import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Animated,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants";
import { CreatePageStyle } from "@/utils";
import { complaintsApi } from "@/api/complaints";
import { LinearGradient } from "expo-linear-gradient";

interface LeaderboardUser {
  complaintsCount: number;
  userDni: string;
  userName: string;
}

const PodiumItem = ({
  rank,
  data,
  style,
}: {
  rank: number;
  data?: LeaderboardUser;
  style?: any;
}) => {
  if (!data) return null;

  const getMedalColor = () => {
    switch (rank) {
      case 1:
        return "#FFD700";
      case 2:
        return "#C0C0C0";
      case 3:
        return "#CD7F32";
      default:
        return Colors.white_60;
    }
  };

  return (
    <View style={styles.podiumItemContainer}>
      <LinearGradient
        colors={[`${getMedalColor()}20`, Colors.white_00]}
        style={[styles.podiumItem, style]}
      >
        <View
          style={[
            styles.medalContainer,
            { backgroundColor: `${getMedalColor()}30` },
          ]}
        >
          <MaterialIcons
            name="emoji-events"
            size={rank === 1 ? 28 : 24}
            color={getMedalColor()}
          />
        </View>
        <Text
          style={[
            styles.position,
            rank === 1 && styles.firstPosition,
            { color: getMedalColor() },
          ]}
        >
          {rank}
        </Text>
        <Text
          style={[styles.name, rank === 1 && styles.firstName]}
          numberOfLines={1}
        >
          {data.userName}
        </Text>
        <View
          style={[
            styles.countContainer,
            { backgroundColor: `${getMedalColor()}15` },
          ]}
        >
          <Text
            style={[
              styles.count,
              rank === 1 && styles.firstCount,
              { color: getMedalColor() },
            ]}
          >
            {data.complaintsCount}
          </Text>
          <Text style={styles.label}>reportes</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const EmptyState = () => (
  <View style={styles.centerContainer}>
    <MaterialIcons name="leaderboard" size={48} color={Colors.white_60} />
    <Text style={styles.emptyText}>No hay datos disponibles</Text>
  </View>
);

const RankingPage = () => {
  const headerHeight = useHeaderHeight();
  const pageStyle = CreatePageStyle(headerHeight);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const scrollY = new Animated.Value(0);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setError(null);
      const data = await complaintsApi.getLeaderboard();
      if (Array.isArray(data)) {
        setLeaderboardData(data);
      } else {
        console.error("Invalid data format:", data);
        throw new Error("Formato de datos inválido");
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setError(
        error instanceof Error ? error.message : "Error al cargar el ranking",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchLeaderboard();
  }, [fetchLeaderboard]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.blue_60} />
        <Text style={styles.loadingText}>Cargando ranking...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <MaterialIcons name="error-outline" size={48} color={Colors.red_60} />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!leaderboardData || leaderboardData.length === 0) {
    return <EmptyState />;
  }

  const topThree = leaderboardData.slice(0, 3);
  const restOfUsers = leaderboardData.slice(3);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: "clamp",
  });

  return (
    <Animated.ScrollView
      style={[pageStyle.container]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.blue_60]}
          tintColor={Colors.blue_60}
        />
      }
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true },
      )}
    >
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <LinearGradient
          colors={[Colors.blue_60 + "20", "transparent"]}
          style={styles.headerGradient}
        >
          <MaterialIcons name="emoji-events" size={40} color={Colors.blue_60} />
          <Text style={styles.title}>Top Ciudadanos Vigilantes</Text>
          <Text style={styles.subtitle}>Ranking de reportes</Text>
        </LinearGradient>
      </Animated.View>

      <View style={styles.podiumContainer}>
        <PodiumItem rank={2} data={topThree[1]} style={styles.secondPlace} />
        <PodiumItem rank={1} data={topThree[0]} style={styles.firstPlace} />
        <PodiumItem rank={3} data={topThree[2]} style={styles.thirdPlace} />
      </View>

      {restOfUsers.length > 0 && (
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Otros participantes</Text>
          {restOfUsers.map((item, index) => (
            <LinearGradient
              key={item.userDni}
              colors={[Colors.white_00, Colors.white_00 + "95"]}
              style={styles.rankingCard}
            >
              <View style={styles.rankingPositionContainer}>
                <Text style={styles.rankingPosition}>{index + 4}</Text>
              </View>
              <View style={styles.rankingInfo}>
                <Text style={styles.rankingName}>{item.userName}</Text>
                <Text style={styles.rankingDni}>DNI: {item.userDni}</Text>
              </View>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>{item.complaintsCount}</Text>
                <Text style={styles.scoreLabel}>reportes</Text>
              </View>
            </LinearGradient>
          ))}
        </View>
      )}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: "Inter_Regular",
    color: Colors.white_60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: "Inter_Regular",
    color: Colors.white_60,
    textAlign: "center",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerGradient: {
    padding: 20,
    alignItems: "center",
    borderRadius: 20,
  },
  header: {
    marginTop: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter_Bold",
    color: Colors.white_80,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_Regular",
    color: Colors.white_60,
    marginTop: 4,
  },
  listTitle: {
    fontSize: 18,
    fontFamily: "Inter_SemiBold",
    color: Colors.white_80,
    marginBottom: 12,
  },
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 10,
    marginBottom: 32,
  },
  podiumItemContainer: {
    flex: 1,
    alignItems: "center",
  },
  podiumItem: {
    width: "94%",
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
  },
  firstPlace: {
    paddingVertical: 24,
    marginTop: -20,
    zIndex: 3,
  },
  secondPlace: {
    paddingVertical: 20,
    marginTop: -10,
    zIndex: 2,
  },
  thirdPlace: {
    paddingVertical: 16,
    zIndex: 1,
  },
  medalContainer: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  position: {
    fontSize: 20,
    fontFamily: "Inter_Bold",
  },
  firstPosition: {
    fontSize: 28,
  },
  name: {
    fontSize: 14,
    fontFamily: "Inter_SemiBold",
    color: Colors.white_80,
    marginVertical: 4,
    textAlign: "center",
    width: "100%",
  },
  firstName: {
    fontSize: 16,
  },
  countContainer: {
    padding: 8,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    minWidth: 80,
  },
  count: {
    fontSize: 18,
    fontFamily: "Inter_Bold",
  },
  firstCount: {
    fontSize: 24,
  },
  label: {
    fontSize: 12,
    fontFamily: "Inter_Regular",
    color: Colors.white_60,
  },
  rankingCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },
  rankingPositionContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white_10,
    justifyContent: "center",
    alignItems: "center",
  },
  rankingPosition: {
    fontSize: 16,
    fontFamily: "Inter_Bold",
    color: Colors.white_60,
  },
  rankingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  rankingName: {
    fontSize: 16,
    fontFamily: "Inter_SemiBold",
    color: Colors.white_80,
  },
  rankingDni: {
    fontSize: 12,
    fontFamily: "Inter_Regular",
    color: Colors.white_60,
  },
  scoreContainer: {
    alignItems: "center",
    backgroundColor: Colors.white_10,
    padding: 8,
    borderRadius: 12,
    minWidth: 70,
  },
  scoreText: {
    fontSize: 18,
    fontFamily: "Inter_Bold",
    color: Colors.blue_60,
  },
  scoreLabel: {
    fontSize: 10,
    fontFamily: "Inter_Regular",
    color: Colors.white_60,
  },
  errorText: {
    color: Colors.white_60,
    marginTop: 8,
    fontSize: 16,
    fontFamily: "Inter_Regular",
    textAlign: "center",
  },
});

export default RankingPage;
