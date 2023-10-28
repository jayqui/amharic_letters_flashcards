import { StyleSheet, ScrollView, Text, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { useState, useEffect } from 'react';
import * as globalStyles from '../globalStyles';
import { getBestAndWorstStats } from '../utils/stats/getTopStats';
import { loadStats, clearAllStats } from '../utils/stats/statsManager';
import { StatsSection as StatsSectionType } from '../types/StatsTypes';
import TopCountSelection from './StatsPage/TopCountSelection';
import StatsSection from './StatsPage/StatsSection';

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
  const [todayStats, setTodayStats] = useState<StatsSectionType>({});
  const [allTimeStats, setAllTimeStats] = useState<StatsSectionType>({});
  const [loading, setLoading] = useState(true);
  const [topCount, setTopCount] = useState('3');

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

  const handleClearStats = () => {
    Alert.alert(
      'Clear All Stats',
      'Are you sure you want to clear all statistics? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllStats();
              setTodayStats({});
              setAllTimeStats({});
            } catch (error) {
              console.error('Error clearing stats:', error);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
        <Text style={{...globalStyles.fontSize48, marginBottom: 20}}> Stats </Text>
        <Text style={globalStyles.fontSize18}>Loading stats...</Text>
      </ScrollView>
    );
  }

  const allTimeBestStats = getBestAndWorstStats(allTimeStats, parseInt(topCount)).bestStats;
  const allTimeWorstStats = getBestAndWorstStats(allTimeStats, parseInt(topCount)).worstStats;
  const todayBestStats = getBestAndWorstStats(todayStats, parseInt(topCount)).bestStats;
  const todayWorstStats = getBestAndWorstStats(todayStats, parseInt(topCount)).worstStats;

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={{...globalStyles.fontSize48, marginBottom: 20}}> Stats </Text>

      <TopCountSelection value={topCount} onValueChange={setTopCount} />

      <StatsSection heading="Best Fidels Today" stats={todayBestStats} />
      <StatsSection heading="Worst Fidels Today" stats={todayWorstStats} />
      <StatsSection heading="Best Fidels All Time" stats={allTimeBestStats} />
      <StatsSection heading="Worst Fidels All Time" stats={allTimeWorstStats} />
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

