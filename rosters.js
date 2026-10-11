/* ==========================================================
   ICEBOUND — FANTASY ROSTER SYSTEM
   File: rosters.js

   FEATURES:
   - Create fantasy teams
   - Add and drop players
   - Set starting lineups
   - Calculate fantasy points
   - Save rosters using browser localStorage
   - Prevent duplicate player selections
   - Validate roster positions and limits

   DEPENDENCY:
   players.js must load before this file.

   IMPORTANT:
   This is a local prototype. Rosters are saved in the
   current browser only, not to a shared online database.
   ========================================================== */

(function () {
  "use strict";

  const STORAGE_KEY = "icebound_rosters_v1";

  // --------------------------------------------------------
  // DEFAULT ROSTER CONFIGURATION
  // These settings can eventually be customized per league.
  // --------------------------------------------------------

  const DEFAULT_SETTINGS = {
    maxRosterSize: 20,

    startingPositions: {
      C: 2,
      LW: 2,
      RW: 2,
      D: 4,
      G: 2
    }
  };

  // --------------------------------------------------------
  // INTERNAL HELPERS
  // --------------------------------------------------------

  function createId() {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      return crypto.randomUUID();
    }

    return (
      "team-" +
      Date.now().toString(36) +
      "-" +
      Math.random().toString(36).slice(2, 10)
    );
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeName(name) {
    const cleaned = String(name || "").trim();

    if (!cleaned) {
      throw new Error("Please enter a team name.");
    }

    return cleaned;
  }

  function getPlayerDatabase() {
    if (
      typeof window.IceboundPlayers === "undefined"
    ) {
      throw new Error(
        "Player database not loaded. Load players.js first."
      );
    }

    return window.IceboundPlayers;
  }

  function getPlayer(playerId) {
    const database = getPlayerDatabase();

    const player = database.getPlayerById(playerId);

    if (!player) {
      throw new Error(
        "Player not found: " + playerId
      );
    }

    return player;
  }

  function loadStoredTeams() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return [];
      }

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error(
        "ICEBOUND could not load saved rosters:",
        error
      );

      return [];
    }
  }

  function saveTeams(teams) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(teams)
      );

      return true;
    } catch (error) {
      console.error(
        "ICEBOUND could not save rosters:",
        error
      );

      throw new Error(
        "Could not save your roster in this browser."
      );
    }
  }

  function findTeam(teams, teamId) {
    return teams.find(function (team) {
      return team.id === teamId;
    }) || null;
  }

  function validateTeam(teams, teamId) {
    const team = findTeam(teams, teamId);

    if (!team) {
      throw new Error("Fantasy team not found.");
    }

    return team;
  }

  function getSettings(team) {
    return Object.assign(
      {},
      DEFAULT_SETTINGS,
      team.settings || {},
      {
        startingPositions: Object.assign(
          {},
          DEFAULT_SETTINGS.startingPositions,
          team.settings
            ? team.settings.startingPositions || {}
            : {}
        )
      }
    );
  }

  function getRosterPlayers(team) {
    const database = getPlayerDatabase();

    return team.playerIds
      .map(function (id) {
        return database.getPlayerById(id);
      })
      .filter(Boolean);
  }

  function saveAndReturn(teams, team) {
    saveTeams(teams);
    return clone(team);
  }

  // --------------------------------------------------------
  // ROSTER MANAGER
  // --------------------------------------------------------

  const IceboundRosters = {

    version: "1.0.0",

    // ------------------------------------------------------
    // CREATE A FANTASY TEAM
    //
    // Example:
    // IceboundRosters.createTeam("Ice Wolves");
    // ------------------------------------------------------

    createTeam: function (teamName, ownerName) {
      const teams = loadStoredTeams();

      const cleanName = normalizeName(teamName);

      const duplicateName = teams.some(function (team) {
        return (
          team.name.toLowerCase() === cleanName.toLowerCase()
        );
      });

      if (duplicateName) {
        throw new Error(
          "A team with that name already exists in this browser."
        );
      }

      const team = {
        id: createId(),
        name: cleanName,
        ownerName: String(ownerName || "Manager").trim(),
        playerIds: [],
        starters: [],
        settings: clone(DEFAULT_SETTINGS),
        createdAt: new Date().toISOString()
      };

      teams.push(team);

      saveTeams(teams);

      return clone(team);
    },

    // ------------------------------------------------------
    // GET ALL FANTASY TEAMS
    // ------------------------------------------------------

    getAllTeams: function () {
      return clone(loadStoredTeams());
    },

    // ------------------------------------------------------
    // GET ONE TEAM
    // ------------------------------------------------------

    getTeam: function (teamId) {
      const teams = loadStoredTeams();

      const team = validateTeam(teams, teamId);

      return clone(team);
    },

    // ------------------------------------------------------
    // RENAME A TEAM
    // ------------------------------------------------------

    renameTeam: function (teamId, newName) {
      const teams = loadStoredTeams();

      const team = validateTeam(teams, teamId);

      const cleanName = normalizeName(newName);

      const duplicate = teams.some(function (other) {
        return (
          other.id !== teamId &&
          other.name.toLowerCase() === cleanName.toLowerCase()
        );
      });

      if (duplicate) {
        throw new Error(
          "Another team already uses that name."
        );
      }

      team.name = cleanName;

      return saveAndReturn(teams, team);
    },

    // ------------------------------------------------------
    // ADD A PLAYER TO A TEAM
    //
    // Example:
    // IceboundRosters.addPlayer(teamId, "player-001");
    // ------------------------------------------------------

    addPlayer: function (teamId, playerId) {
      const teams = loadStoredTeams();

      const team = validateTeam(teams, teamId);

      const player = getPlayer(playerId);

      const settings = getSettings(team);

      if (team.playerIds.includes(player.id)) {
        throw new Error(
          player.name + " is already on this roster."
        );
      }

      if (team.playerIds.length >= settings.maxRosterSize) {
        throw new Error(
          "Your roster is full. Drop a player first."
        );
      }

      team.playerIds.push(player.id);

      return saveAndReturn(teams, team);
    },

    // ------------------------------------------------------
    // DROP A PLAYER
    // ------------------------------------------------------

    dropPlayer: function (teamId, playerId) {
      const teams = loadStoredTeams();

      const team = validateTeam(teams, teamId);

      if (!team.playerIds.includes(playerId)) {
        throw new Error(
          "That player is not on your roster."
        );
      }

      team.playerIds = team.playerIds.filter(function (id) {
        return id !== playerId;
      });

      // Remove the player from the starting lineup too.
      team.starters = team.starters.filter(function (id) {
        return id !== playerId;
      });

      return saveAndReturn(teams, team);
    },

    // ------------------------------------------------------
    // GET THE FULL ROSTER WITH PLAYER INFORMATION
    // ------------------------------------------------------

    getRoster: function (teamId) {
      const teams = loadStoredTeams();

      const team = validateTeam(teams, teamId);

      return getRosterPlayers(team).map(function (player) {
        return clone(player);
      });
    },

    // ------------------------------------------------------
    // GET AVAILABLE PLAYERS
    //
    // Players already rostered by this team are excluded.
    // Players on other teams are NOT excluded yet because
    // league-wide ownership requires a shared league database.
    // ------------------------------------------------------

    getAvailablePlayers: function (teamId, filters) {
      const teams = loadStoredTeams();

      const team = validateTeam(teams, teamId);

      const database = getPlayerDatabase();

      const options = filters || {};

      let players = database.getAllPlayers().filter(
        function (player) {
          return !team.playerIds.includes(player.id);
        }
      );

      if (options.position) {
        const position = String(options.position).toUpperCase();

        players = players.filter(function (player) {
          return player.position === position;
        });
      }

      if (options.team) {
        const nhlTeam = String(options.team).toUpperCase();

        players = players.filter(function (player) {
          return player.team === nhlTeam;
        });
      }

      if (options.status) {
        const status = String(options.status).toLowerCase();

        players = players.filter(function (player) {
          return player.status.toLowerCase() === status;
        });
      }

      if (options.search) {
        const search = String(options.search).toLowerCase();

        players = players.filter(function (player) {
          return player.name.toLowerCase().includes(search);
        });
      }

      return players;
    },

    // ------------------------------------------------------
    // SET A PLAYER AS A STARTER
    //
    // Only players already on the roster can start.
    // A player can only occupy one starting position.
    // ------------------------------------------------------

    setStarter: function (teamId, playerId) {
      const teams = loadStoredTeams();

      const team = validateTeam(teams, teamId);

      const player = getPlayer(playerId);

      const settings = getSettings(team);

      if (!team.playerIds.includes(playerId)) {
        throw new Error(
          "Add this player to your roster before starting them."
        );
      }

      const allowedCount =
        settings.startingPositions[player.position] || 0;

      if (allowedCount === 0) {
        throw new Error(
          "This position is not allowed in your starting lineup."
        );
      }

      if (team.starters.includes(playerId)) {
        return clone(team);
      }

      const samePositionStarters = team.starters.filter(
        function (starterId) {
          const starter = getPlayerDatabase().getPlayerById(
            starterId
          );

          return (
            starter &&
            starter.position === player.position
          );
        }
      );

      if (samePositionStarters.length >= allowedCount) {
        throw new Error(
          "All starting spots for " +
          player.position +
          " are filled."
        );
      }

      team.starters.push(playerId);

      return saveAndReturn(teams, team);
    },

    // ------------------------------------------------------
    // REMOVE A PLAYER FROM THE STARTING LINEUP
    // The player remains on the roster.
    // ------------------------------------------------------

    benchPlayer: function (teamId, playerId) {
      const teams = loadStoredTeams();

      const team = validateTeam(teams, teamId);

      team.starters = team.starters.filter(function (id) {
        return id !== playerId;
      });

      return saveAndReturn(teams, team);
    },

    // ------------------------------------------------------
    // GET STARTING LINEUP
    // ------------------------------------------------------

    getStartingLineup: function (teamId) {
      const teams = loadStoredTeams();

      const team = validateTeam(teams, teamId);

      return team.starters
        .map(function (id) {
          return getPlayerDatabase().getPlayerById(id);
        })
        .filter(Boolean)
        .map(function (player) {
          return clone(player);
        });
    },

    // ------------------------------------------------------
    // GET STARTING LINEUP REQUIREMENTS
    // ------------------------------------------------------

    getLineupStatus: function (teamId) {
      const teams = loadStoredTeams();

      const team = validateTeam(teams, teamId);

      const settings = getSettings(team);

      const status = {};

      Object.keys(settings.startingPositions).forEach(
        function (position) {
          const startersAtPosition = team.starters.filter(
            function (id) {
              const player =
                getPlayerDatabase().getPlayerById(id);

              return (
                player &&
                player.position === position
              );
            }
          ).length;

          status[position] = {
            required: settings.startingPositions[position],
            selected: startersAtPosition,
            remaining: Math.max(
              0,
              settings.startingPositions[position] -
              startersAtPosition
            )
          };
        }
      );

      return status;
    },

    // ------------------------------------------------------
    // CALCULATE TOTAL ROSTER FANTASY POINTS
    // ------------------------------------------------------

    getRosterFantasyPoints: function (
      teamId,
      scoringOverrides
    ) {
      const roster = this.getRoster(teamId);

      const database = getPlayerDatabase();

      return roster.reduce(function (total, player) {
        return (
          total +
          database.getFantasyPoints(player, scoringOverrides)
        );
      }, 0);
    },

    // ------------------------------------------------------
    // CALCULATE STARTING LINEUP FANTASY POINTS
    // ------------------------------------------------------

    getStartingFantasyPoints: function (
      teamId,
      scoringOverrides
    ) {
      const lineup = this.getStartingLineup(teamId);

      const database = getPlayerDatabase();

      return lineup.reduce(function (total, player) {
        return (
          total +
          database.getFantasyPoints(player, scoringOverrides)
        );
      }, 0);
    },

    // ------------------------------------------------------
    // CHANGE ROSTER SIZE LIMIT
    // ------------------------------------------------------

    updateSettings: function (teamId, newSettings) {
      const teams = loadStoredTeams();

      const team = validateTeam(teams, teamId);

      const updated = newSettings || {};

      if (updated.maxRosterSize !== undefined) {
        const limit = Number(updated.maxRosterSize);

        if (!Number.isInteger(limit) || limit < 1) {
          throw new Error(
            "Roster size must be a positive whole number."
          );
        }

        if (team.playerIds.length > limit) {
          throw new Error(
            "The new limit is smaller than your current roster."
          );
        }

        team.settings.maxRosterSize = limit;
      }

      if (updated.startingPositions) {
        const positions = updated.startingPositions;

        Object.keys(positions).forEach(function (position) {
          const count = Number(positions[position]);

          if (!Number.isInteger(count) || count < 0) {
            throw new Error(
              "Starting position limits must be zero or greater."
            );
          }
        });

        team.settings.startingPositions = Object.assign(
          {},
          team.settings.startingPositions,
          positions
        );
      }

      return saveAndReturn(teams, team);
    },

    // ------------------------------------------------------
    // DELETE A TEAM
    // This permanently removes its locally saved roster.
    // ------------------------------------------------------

    deleteTeam: function (teamId) {
      const teams = loadStoredTeams();

      const team = validateTeam(teams, teamId);

      const remainingTeams = teams.filter(function (item) {
        return item.id !== team.id;
      });

      saveTeams(remainingTeams);

      return {
        success: true,
        deletedTeamId: teamId
      };
    },

    // ------------------------------------------------------
    // RESET ALL LOCAL TEAMS
    // USE CAREFULLY: This deletes every ICEBOUND roster
    // saved in the current browser.
    // ------------------------------------------------------

    resetAllTeams: function () {
      saveTeams([]);

      return {
        success: true,
        message: "All local ICEBOUND rosters were deleted."
      };
    }
  };

  // Make the roster manager available to other scripts.
  window.IceboundRosters = IceboundRosters;

})();