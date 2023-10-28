import { Text, View, StyleSheet } from 'react-native';
import * as globalStyles from '../../globalStyles';
import { StatsSection as StatsSectionType } from '../../types/StatsTypes';

type StatsSectionProps = {
  heading: string;
  stats: StatsSectionType;
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
    backgroundColor: globalStyles.charcoal10,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: globalStyles.charcoal20,
  },
  heading: {
    ...globalStyles.fontSize24,
    marginBottom: 12,
    fontWeight: '600',
    color: globalStyles.charcoal120,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  letter: {
    ...globalStyles.fontSize20,
    fontWeight: 'bold',
    width: 30,
    color: globalStyles.charcoal120,
  },
  progressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: globalStyles.charcoal20,
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  statText: {
    ...globalStyles.fontSize16,
    color: globalStyles.secondaryTextColor,
    minWidth: 80,
    textAlign: 'right',
  },
});

function getProgressBarColor(percentage: number) {
  if (percentage >= 80) return globalStyles.green40;
  if (percentage >= 60) return globalStyles.yellow40;
  return globalStyles.red40;
}

export default function StatsSection({ heading, stats }: StatsSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{heading}</Text>
      {Object.entries(stats).map(([letter, { correct, attempted }]) => {
        const percentCorrect = (correct / attempted) * 100;
        const progressColor = getProgressBarColor(percentCorrect);

        return (
          <View key={letter} style={styles.statItem}>
            <Text style={styles.letter}>{letter}</Text>
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${percentCorrect}%`,
                    backgroundColor: progressColor
                  }
                ]}
              />
            </View>
            <Text style={styles.statText}>
              {percentCorrect.toFixed(0)}% ({correct}/{attempted})
            </Text>
          </View>
        );
      })}
    </View>
  );
}
