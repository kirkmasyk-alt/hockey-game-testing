/* ==========================================================
   ICEBOUND — FANTASY DRAFT SYSTEM
   File: draft.js

   Requires:
   - players.js

   Features:
   - Create a draft
   - Add fantasy teams
   - Randomize draft order
   - Snake draft support
   - Draft players
   - Prevent duplicate selections
   - Track drafted players and team ownership
   - Undo the last pick
   - Track draft completion

   NOTE:
   This version runs locally in the browser.
   It is not yet a multiplayer online draft.
   ========================================================== */

(function () {
  "use strict";

  const STORAGE_KEY = "icebound_drafts_v1";

  function createId() {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      return crypto.randomUUID();
    }

    return (
      "draft-" +
      Date.now().toString(36) +
      "-" +
      Math.random().toString(36).slice(2, 9)
    );
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function loadDrafts() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return [];
      }

      const drafts = JSON.parse(saved);

      return Array.isArray(drafts) ? drafts : [];
    } catch (error) {
      console.error("ICEBOUND draft loading failed:", error);
      return [];
    }
  }

  function saveDrafts(drafts) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(drafts)
      );
    } catch (error) {
      throw new Error(
        "Could not save the draft in this browser."
      );
    }
  }

  function findDraft(drafts, draftId) {
    return drafts.find(function (draft) {
      return draft.id === draftId;
    }) || null;
  }

  function requireDraft(drafts, draftId) {
    const draft = findDraft(drafts, draftId);

    if (!draft) {
      throw new Error("Draft not found.");
    }

    return draft;
  }

  function requirePlayerDatabase() {
    if (!window.IceboundPlayers) {
      throw new Error(
        "Load players.js before using the draft system."
      );
    }

    return window.IceboundPlayers;
  }

  function getCurrentRound(draft) {
    return Math.floor(
      draft.picks.length / draft.teamIds.length
    ) + 1;
  }

  function getCurrentPickNumber(draft) {
    return draft.picks.length + 1;
  }

  function getCurrentTeamIndex(draft) {
    const teamCount = draft.teamIds.length;
    const roundIndex = Math.floor(
      draft.picks.length / teamCount
    );
    const positionInRound = draft.picks.length % teamCount;

    if (draft.settings.snakeDraft && roundIndex % 2 === 1) {
      return teamCount - 1 - positionInRound;
    }

    return positionInRound;
  }

  function getCurrentTeamId(draft) {
    if (draft.completed) {
      return null;
    }

    return draft.teamIds[getCurrentTeamIndex(draft)];
  }

  function updateCompletion(draft) {
    const totalPicks =
      draft.teamIds.length * draft.settings.rounds;

    draft.completed = draft.picks.length >= totalPicks;
  }

  const IceboundDraft = {

    version: "1.0.0",

    // ------------------------------------------------------
    // CREATE A NEW DRAFT
    // ------------------------------------------------------

    createDraft: function (name, settings) {
      const cleanName = String(name || "").trim();

      if (!cleanName) {
        throw new Error("Enter a name for your draft.");
      }

      const options = settings || {};

      const rounds = Number(options.rounds || 5);

      if (!Number.isInteger(rounds) || rounds < 1) {
        throw new Error(
          "Draft rounds must be a positive whole number."
        );
      }

      const draft = {
        id: createId(),
        name: cleanName,
        teamIds: [],
        teams: {},
        picks: [],
        settings: {
          rounds: rounds,
          snakeDraft: options.snakeDraft !== false,
          randomizedOrder: false
        },
        completed: false,
        createdAt: new Date().toISOString()
      };

      const drafts = loadDrafts();

      drafts.push(draft);

      saveDrafts(drafts);

      return clone(draft);
    },

    // ------------------------------------------------------
    // ADD A TEAM TO THE DRAFT
    // ------------------------------------------------------

    addTeam: function (draftId, teamId, teamName) {
      const drafts = loadDrafts();

      const draft = requireDraft(drafts, draftId);

      if (draft.picks.length > 0) {
        throw new Error(
          "Teams cannot be added after the draft begins."
        );
      }

      if (draft.teamIds.includes(teamId)) {
        throw new Error(
          "This team is already in the draft."
        );
      }

      const cleanName = String(teamName || "").trim();

      if (!cleanName) {
        throw new Error("Enter a team name.");
      }

      draft.teamIds.push(teamId);

      draft.teams[teamId] = {
        id: teamId,
        name: cleanName
      };

      saveDrafts(drafts);

      return clone(draft);
    },

    // ------------------------------------------------------
    // RANDOMIZE DRAFT ORDER
    // ------------------------------------------------------

    randomizeOrder: function (draftId) {
      const drafts = loadDrafts();

      const draft = requireDraft(drafts, draftId);

      if (draft.picks.length > 0) {
        throw new Error(
          "The draft order cannot change after the draft begins."
        );
      }

      if (draft.teamIds.length < 2) {
        throw new Error(
          "Add at least two teams before randomizing."
        );
      }

      for (let i = draft.teamIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [
          draft.teamIds[i],
          draft.teamIds[j]
        ] = [
          draft.teamIds[j],
          draft.teamIds[i]
        ];
      }

      draft.settings.randomizedOrder = true;

      saveDrafts(drafts);

      return clone(draft);
    },

    // ------------------------------------------------------
    // GET DRAFT DETAILS
    // ------------------------------------------------------

    getDraft: function (draftId) {
      const drafts = loadDrafts();

      return clone(requireDraft(drafts, draftId));
    },

    // ------------------------------------------------------
    // GET ALL DRAFTS
    // ------------------------------------------------------

    getAllDrafts: function () {
      return clone(loadDrafts());
    },

    // ------------------------------------------------------
    // GET THE TEAM THAT PICKS NEXT
    // ------------------------------------------------------

    getCurrentPick: function (draftId) {
      const drafts = loadDrafts();

      const draft = requireDraft(drafts, draftId);

      if (draft.teamIds.length === 0) {
        return null;
      }

      if (draft.completed) {
        return null;
      }

      const teamId = getCurrentTeamId(draft);

      return {
        pickNumber: getCurrentPickNumber(draft),
        round: getCurrentRound(draft),
        teamId: teamId,
        team: clone(draft.teams[teamId])
      };
    },

    // ------------------------------------------------------
    // GET ALL AVAILABLE PLAYERS
    // ------------------------------------------------------

    getAvailablePlayers: function (draftId, filters) {
      const drafts = loadDrafts();

      const draft = requireDraft(drafts, draftId);

      const database = requirePlayerDatabase();

      const draftedIds = draft.picks.map(function (pick) {
        return pick.playerId;
      });

      const options = filters || {};

      let players = database.getAllPlayers().filter(
        function (player) {
          return !draftedIds.includes(player.id);
        }
      );

      if (options.position) {
        const position = String(options.position).toUpperCase();

        players = players.filter(function (player) {
          return player.position === position;
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
    // MAKE A DRAFT PICK
    // ------------------------------------------------------

    makePick: function (draftId, playerId) {
      const drafts = loadDrafts();

      const draft = requireDraft(drafts, draftId);

      const database = requirePlayerDatabase();

      if (draft.completed) {
        throw new Error("This draft is already complete.");
      }

      if (draft.teamIds.length === 0) {
        throw new Error(
          "Add teams before making a draft pick."
        );
      }

      const player = database.getPlayerById(playerId);

      if (!player) {
        throw new Error("Player not found.");
      }

      const alreadyDrafted = draft.picks.some(
        function (pick) {
          return pick.playerId === playerId;
        }
      );

      if (alreadyDrafted) {
        throw new Error(
          player.name + " has already been drafted."
        );
      }

      const teamId = getCurrentTeamId(draft);

      const pick = {
        pickNumber: draft.picks.length + 1,
        round: getCurrentRound(draft),
        teamId: teamId,
        teamName: draft.teams[teamId].name,
        playerId: player.id,
        playerName: player.name,
        position: player.position,
        nhlTeam: player.team,
        timestamp: new Date().toISOString()
      };

      draft.picks.push(pick);

      updateCompletion(draft);

      saveDrafts(drafts);

      return clone(pick);
    },

    // ------------------------------------------------------
    // GET DRAFT PICKS
    // ------------------------------------------------------

    getPicks: function (draftId) {
      const drafts = loadDrafts();

      const draft = requireDraft(drafts, draftId);

      return clone(draft.picks);
    },

    // ------------------------------------------------------
    // GET PICKS FOR ONE TEAM
    // ------------------------------------------------------

    getTeamPicks: function (draftId, teamId) {
      const drafts = loadDrafts();

      const draft = requireDraft(drafts, draftId);

      return clone(
        draft.picks.filter(function (pick) {
          return pick.teamId === teamId;
        })
      );
    },

    // ------------------------------------------------------
    // UNDO THE MOST RECENT PICK
    // ------------------------------------------------------

    undoLastPick: function (draftId) {
      const drafts = loadDrafts();

      const draft = requireDraft(drafts, draftId);

      if (draft.picks.length === 0) {
        throw new Error("There are no picks to undo.");
      }

      const removedPick = draft.picks.pop();

      draft.completed = false;

      saveDrafts(drafts);

      return clone(removedPick);
    },

    // ------------------------------------------------------
    // GET DRAFT PROGRESS
    // ------------------------------------------------------

    getProgress: function (draftId) {
      const drafts = loadDrafts();

      const draft = requireDraft(drafts, draftId);

      const totalPicks =
        draft.teamIds.length * draft.settings.rounds;

      return {
        totalPicks: totalPicks,
        completedPicks: draft.picks.length,
        remainingPicks: Math.max(
          0,
          totalPicks - draft.picks.length
        ),
        percentage: totalPicks === 0
          ? 0
          : Math.round(
              (draft.picks.length / totalPicks) * 100
            ),
        completed: draft.completed
      };
    },

    // ------------------------------------------------------
    // DELETE A DRAFT
    // ------------------------------------------------------

    deleteDraft: function (draftId) {
      const drafts = loadDrafts();

      const draft = requireDraft(drafts, draftId);

      saveDrafts(
        drafts.filter(function (item) {
          return item.id !== draft.id;
        })
      );

      return {
        success: true,
        deletedDraftId: draftId
      };
    }
  };

  // Make the draft system available to the app.
  window.IceboundDraft = IceboundDraft;

})();