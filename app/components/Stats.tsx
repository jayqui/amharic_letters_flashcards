import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useState, useEffect } from 'react';
import * as globalStyles from '../globalStyles';
import { getBestAndWorstStats } from '../utils/stats/getTopStats';
import { loadStats, clearAllStats } from '../utils/stats/statsManager';
import { StatsSection } from '../types/StatsTypes';

const styles = StyleSheet.create({
  clearButton: {
    ...globalStyles.standardButton,
    borderColor: globalStyles.red30,
    backgroundColor: globalStyles.red0,
    borderWidth: 2,
  },
  clearButtonLabel: {
    ...globalStyles.standardButtonLabel,
    color: globalStyles.red40,
  },
});

export default function Stats() {
  const [todayStats, setTodayStats] = useState<StatsSection>({});
  const [allTimeStats, setAllTimeStats] = useState<StatsSection>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatsData();
  }, []);

  const loadStatsData = async () => {
    try {
      const { today, allTime } = await loadStats();
      setTodayStats(today);
      setAllTimeStats(allTime);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearStats = async () => {
    try {
      await clearAllStats();
      setTodayStats({});
      setAllTimeStats({});
    } catch (error) {
      console.error('Error clearing stats:', error);
    }
  };

  if (loading) {
    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
        <Text style={{...globalStyles.fontSize48, marginBottom: 20}}> Stats </Text>
        <Text style={globalStyles.fontSize18}>Loading stats...</Text>
      </ScrollView>
    );
  }

  const todayBestStats = getBestAndWorstStats(todayStats).bestStats;
  const todayWorstStats = getBestAndWorstStats(todayStats).worstStats;
  const allTimeBestStats = getBestAndWorstStats(allTimeStats).bestStats;
  const allTimeWorstStats = getBestAndWorstStats(allTimeStats).worstStats;

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={{...globalStyles.fontSize48, marginBottom: 20}}> Stats </Text>
      {renderStatsSection('Best Fidels Today', todayBestStats)}
      {renderStatsSection('Best Fidels All Time', allTimeBestStats)}
      {renderStatsSection('Worst Fidels Today', todayWorstStats)}
      {renderStatsSection('Worst Fidels All Time', allTimeWorstStats)}
      <Button
        mode="contained-tonal"
        icon="trash-can-outline"
        style={styles.clearButton}
        contentStyle={globalStyles.standardButtonContent}
        labelStyle={styles.clearButtonLabel}
        onPress={handleClearStats}
      >
        Clear Stats
      </Button>
    </ScrollView>
  );
}

function renderStatsSection(
  heading: string,
  stats: StatsSection,
) {

  return (
    <View style={{marginBottom: 20, width: '100%'}}>
      <Text style={globalStyles.fontSize24}>{heading}</Text>
      {Object.entries(stats).map(([letter, { correct, attempted }]) => {
        const percentCorrect = (correct / attempted) * 100;
        return (
          <Text key={letter} style={globalStyles.fontSize18}>
            {letter}: {percentCorrect.toFixed(0)}% ({correct} of {attempted})
          </Text>
        );
      })}
    </View>
  );
}
