CREATE OR REPLACE VIEW leaderboard_view AS
SELECT
	ROW_NUMBER() OVER(ORDER BY(COALESCE(points, 0)) DESC) AS "Rank",
	username AS "User",
	COALESCE(solvedChallenges, 0) AS "Challenges solved",
	COALESCE(points, 0) AS "Total points"
FROM
	"User" u
LEFT JOIN (
	SELECT
		sum(c.points) AS points,
		count(uc) AS solvedChallenges,
		uc."userId" AS userId
	FROM
		"Challenge" c
	LEFT JOIN
		"UserChallenge" uc ON c.id = uc."challengeId"
	WHERE
		uc."isSolved" = TRUE
		AND c."isActive" = TRUE
	GROUP BY
		uc."userId"
) cucAggr ON cucAggr.userId = u.id
ORDER BY "Total points" DESC
