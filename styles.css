/* ==========================================================
   ICEBOUND — PLAYER DATABASE
   File: players.js

   Purpose:
   - Store player information
   - Track player positions and NHL teams
   - Store demonstration statistics
   - Calculate basic fantasy points
   - Search and filter the player database

   IMPORTANT:
   The players and statistics below are demonstration data.
   They are NOT live NHL statistics.
   ========================================================== */

(function () {
  "use strict";

  const IceboundPlayers = {
    version: "1.0.0",

    // ------------------------------------------------------
    // FANTASY SCORING SETTINGS
    // These values can eventually be customized by each league.
    // ------------------------------------------------------

    scoring: {
      goal: 3,
      assist: 2,
      shot: 0.2,
      hit: 0.2,
      blockedShot: 0.5,
      powerPlayPoint: 0.5,
      shortHandedPoint: 1,
      win: 4,
      save: 0.2,
      shutout: 3,
      penaltyMinutes: -0.1
    },

    // ------------------------------------------------------
    // DEMONSTRATION PLAYER DATABASE
    //
    // Player IDs are permanent internal identifiers.
    // NHL teams and player statistics are sample data.
    // ------------------------------------------------------

    players: [
      {
        id: "player-001",
        name: "Connor McDavid",
        firstName: "Connor",
        lastName: "McDavid",
        position: "C",
        team: "EDM",
        number: 97,
        shoots: "Left",
        status: "Active",
        isGoalie: false,

        stats: {
          goals: 35,
          assists: 82,
          shots: 245,
          hits: 30,
          blockedShots: 20,
          powerPlayPoints: 35,
          shortHandedPoints: 2,
          gamesPlayed: 70
        }
      },

      {
        id: "player-002",
        name: "Leon Draisaitl",
        firstName: "Leon",
        lastName: "Draisaitl",
        position: "C",
        team: "EDM",
        number: 29,
        shoots: "Left",
        status: "Active",
        isGoalie: false,

        stats: {
          goals: 40,
          assists: 55,
          shots: 210,
          hits: 45,
          blockedShots: 25,
          powerPlayPoints: 30,
          shortHandedPoints: 1,
          gamesPlayed: 70
        }
      },

      {
        id: "player-003",
        name: "Auston Matthews",
        firstName: "Auston",
        lastName: "Matthews",
        position: "C",
        team: "TOR",
        number: 34,
        shoots: "Left",
        status: "Active",
        isGoalie: false,

        stats: {
          goals: 50,
          assists: 35,
          shots: 300,
          hits: 40,
          blockedShots: 15,
          powerPlayPoints: 20,
          shortHandedPoints: 0,
          gamesPlayed: 70
        }
      },

      {
        id: "player-004",
        name: "Nathan MacKinnon",
        firstName: "Nathan",
        lastName: "MacKinnon",
        position: "C",
        team: "COL",
        number: 29,
        shoots: "Right",
        status: "Active",
        isGoalie: false,

        stats: {
          goals: 38,
          assists: 65,
          shots: 280,
          hits: 55,
          blockedShots: 20,
          powerPlayPoints: 28,
          shortHandedPoints: 1,
          gamesPlayed: 70
        }
      },

      {
        id: "player-005",
        name: "David Pastrnak",
        firstName: "David",
        lastName: "Pastrnak",
        position: "RW",
        team: "BOS",
        number: 88,
        shoots: "Right",
        status: "Active",
        isGoalie: false,

        stats: {
          goals: 42,
          assists: 48,
          shots: 270,
          hits: 35,
          blockedShots: 18,
          powerPlayPoints: 25,
          shortHandedPoints: 0,
          gamesPlayed: 70
        }
      },

      {
        id: "player-006",
        name: "Nikita Kucherov",
        firstName: "Nikita",
        lastName: "Kucherov",
        position: "RW",
        team: "TBL",
        number: 86,
        shoots: "Left",
        status: "Active",
        isGoalie: false,

        stats: {
          goals: 35,
          assists: 75,
          shots: 220,
          hits: 25,
          blockedShots: 12,
          powerPlayPoints: 32,
          shortHandedPoints: 0,
          gamesPlayed: 70
        }
      },

      {
        id: "player-007",
        name: "Cale Makar",
        firstName: "Cale",
        lastName: "Makar",
        position: "D",
        team: "COL",
        number: 8,
        shoots: "Right",
        status: "Active",
        isGoalie: false,

        stats: {
          goals: 20,
          assists: 55,
          shots: 180,
          hits: 50,
          blockedShots: 65,
          powerPlayPoints: 30,
          shortHandedPoints: 1,
          gamesPlayed: 70
        }
      },

      {
        id: "player-008",
        name: "Quinn Hughes",
        firstName: "Quinn",
        lastName: "Hughes",
        position: "D",
        team: "VAN",
        number: 43,
        shoots: "Left",
        status: "Active",
        isGoalie: false,

        stats: {
          goals: 10,
          assists: 60,
          shots: 120,
          hits: 35,
          blockedShots: 75,
          powerPlayPoints: 25,
          shortHandedPoints: 2,
          gamesPlayed: 70
        }
      },

      {
        id: "player-009",
        name: "Sidney Crosby",
        firstName: "Sidney",
        lastName: "Crosby",
        position: "C",
        team: "PIT",
        number: 87,
        shoots: "Left",
        status: "Active",
        isGoalie: false,

        stats: {
          goals: 30,
          assists: 45,
          shots: 190,
          hits: 45,
          blockedShots: 30,
          powerPlayPoints: 18,
          shortHandedPoints: 1,
          gamesPlayed: 70
        }
      },

      {
        id: "player-010",
        name: "Igor Shesterkin",
        firstName: "Igor",
        lastName: "Shesterkin",
        position: "G",
        team: "NYR",
        number: 31,
        shoots: null,
        status: "Active",
        isGoalie: true,

        stats: {
          wins: 30,
          saves: 1500,
          shutouts: 4,
          goalsAgainst: 145,
          gamesPlayed: 45
        }
      },

      {
        id: "player-011",
        name: "Connor Hellebuyck",
        firstName: "Connor",
        lastName: "Hellebuyck",
        position: "G",
        team: "WPG",
        number: 37,
        shoots: null,
        status: "Active",
        isGoalie: true,

        stats: {
          wins: 35,
          saves: 1600,
          shutouts: 5,
          goalsAgainst: 130,
          gamesPlayed: 48
        }
      },

      {
        id: "player-012",
        name: "Leonard Example",
        firstName: "Leonard",
        lastName: "Example",
        position: "LW",
        team: "ICE",
        number: 99,
        shoots: "Left",
        status: "Injured",
        isGoalie: false,

        stats: {
          goals: 12,
          assists: 15,
          shots: 80,
          hits: 25,
          blockedShots: 10,
          powerPlayPoints: 4,
          shortHandedPoints: 0,
          gamesPlayed: 30
        }
      }
    ],

    // ------------------------------------------------------
    // FIND A PLAYER BY ID
    // Example:
    // IceboundPlayers.getPlayerById("player-001")
    // ------------------------------------------------------

    getPlayerById: function (id) {
      return this.players.find(function (player) {
        return player.id === id;
      }) || null;
    },

    // ------------------------------------------------------
    // SEARCH BY PLAYER NAME
    // Example:
    // IceboundPlayers.searchPlayers("Connor")
    // ------------------------------------------------------

    searchPlayers: function (query) {
      const search = String(query || "").trim().toLowerCase();

      if (!search) {
        return this.players.slice();
      }

      return this.players.filter(function (player) {
        return player.name.toLowerCase().includes(search);
      });
    },

    // ------------------------------------------------------
    // FILTER BY POSITION
    // Supported: C, LW, RW, D, G
    // ------------------------------------------------------

    getPlayersByPosition: function (position) {
      const requestedPosition = String(position || "")
        .trim()
        .toUpperCase();

      if (!requestedPosition) {
        return this.players.slice();
      }

      return this.players.filter(function (player) {
        return player.position === requestedPosition;
      });
    },

    // ------------------------------------------------------
    // FILTER BY TEAM
    // Example:
    // IceboundPlayers.getPlayersByTeam("EDM")
    // ------------------------------------------------------

    getPlayersByTeam: function (team) {
      const requestedTeam = String(team || "").trim().toUpperCase();

      return this.players.filter(function (player) {
        return player.team === requestedTeam;
      });
    },

    // ------------------------------------------------------
    // FILTER BY PLAYER STATUS
    // Examples: Active, Injured
    // ------------------------------------------------------

    getPlayersByStatus: function (status) {
      const requestedStatus = String(status || "").trim().toLowerCase();

      return this.players.filter(function (player) {
        return player.status.toLowerCase() === requestedStatus;
      });
    },

    // ------------------------------------------------------
    // CALCULATE SKATER FANTASY POINTS
    // ------------------------------------------------------

    calculateSkaterPoints: function (player, scoringOverrides) {
      if (!player || player.isGoalie) {
        return 0;
      }

      const stats = player.stats || {};
      const scoring = Object.assign(
        {},
        this.scoring,
        scoringOverrides || {}
      );

      return (
        (stats.goals || 0) * scoring.goal +
        (stats.assists || 0) * scoring.assist +
        (stats.shots || 0) * scoring.shot +
        (stats.hits || 0) * scoring.hit +
        (stats.blockedShots || 0) * scoring.blockedShot +
        (stats.powerPlayPoints || 0) * scoring.powerPlayPoint +
        (stats.shortHandedPoints || 0) * scoring.shortHandedPoint
      );
    },

    // ------------------------------------------------------
    // CALCULATE GOALIE FANTASY POINTS
    // ------------------------------------------------------

    calculateGoaliePoints: function (player, scoringOverrides) {
      if (!player || !player.isGoalie) {
        return 0;
      }

      const stats = player.stats || {};
      const scoring = Object.assign(
        {},
        this.scoring,
        scoringOverrides || {}
      );

      return (
        (stats.wins || 0) * scoring.win +
        (stats.saves || 0) * scoring.save +
        (stats.shutouts || 0) * scoring.shutout
      );
    },

    // ------------------------------------------------------
    // GET FANTASY POINTS FOR ANY PLAYER
    // ------------------------------------------------------

    getFantasyPoints: function (playerOrId, scoringOverrides) {
      const player =
        typeof playerOrId === "string"
          ? this.getPlayerById(playerOrId)
          : playerOrId;

      if (!player) {
        return 0;
      }

      if (player.isGoalie) {
        return this.calculateGoaliePoints(player, scoringOverrides);
      }

      return this.calculateSkaterPoints(player, scoringOverrides);
    },

    // ------------------------------------------------------
    // GET PLAYERS SORTED BY FANTASY POINTS
    // ------------------------------------------------------

    getRankings: function (position, scoringOverrides) {
      let list = position
        ? this.getPlayersByPosition(position)
        : this.players.slice();

      return list.sort((a, b) => {
        return (
          this.getFantasyPoints(b, scoringOverrides) -
          this.getFantasyPoints(a, scoringOverrides)
        );
      });
    },

    // ------------------------------------------------------
    // RETURN A SAFE COPY OF THE PLAYER DATABASE
    // ------------------------------------------------------

    getAllPlayers: function () {
      return this.players.map(function (player) {
        return JSON.parse(JSON.stringify(player));
      });
    }
  };

  // Make the database available to other browser scripts.
  window.IceboundPlayers = IceboundPlayers;

})();