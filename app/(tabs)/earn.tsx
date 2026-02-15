import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { getStats } from "../../api/api";

export default function EarnScreen() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const backgroundColor = "#0b0f10";
  const cardColor = "#11181c";
  const textColor = "#f5f5f5";

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      fetchStats();
    }
  }, [isFocused]);

  async function fetchStats() {
    try {
      const data = await getStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor }]}>
        <ActivityIndicator size="large" color="#4da6ff" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Your Progress</Text>

      <View style={[styles.statCard, { backgroundColor: cardColor }]}>
        <StatRow
          label="Total Games"
          value={stats.totalGames}
          textColor={textColor}
        />
        <StatRow
          label="Total Correct Answers"
          value={stats.totalCorrectAnswers}
          textColor={textColor}
        />
        <StatRow
          label="Total Attempts"
          value={stats.totalAttempts}
          textColor={textColor}
        />
        <StatRow
          label="Average Score"
          value={`${stats.averageScore}%`}
          textColor={textColor}
        />
        <StatRow
          label="Total Time"
          value={`${stats.totalDuration}s`}
          textColor={textColor}
        />
      </View>
    </View>
  );
}

function StatRow({
  label,
  value,
  textColor,
}: {
  label: string;
  value: string | number;
  textColor: string;
}) {
  return (
    <View style={styles.statRow}>
      <Text style={[styles.statLabel, { color: textColor }]}>{label}</Text>
      <Text style={[styles.statValue, { color: textColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  statCard: {
    borderRadius: 12,
    padding: 16,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  statLabel: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
  },
});
