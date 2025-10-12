import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import * as globalStyles from '../globalStyles';
import { todayBestStats, allTimeBestStats, todayWorstStats, allTimeWorstStats } from '../utils/stats/calculateStats';
// import { StatsSection } from '../types/StatsTypes';

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
      >
                Clear Stats
      </Button>
    </ScrollView>
  );
}

function renderStatsSection(
  heading: string,
  stats: { [key: string]: { correct: number, attempted: number } },
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
