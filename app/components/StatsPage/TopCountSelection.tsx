import { StyleSheet, Text, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import * as globalStyles from '../../globalStyles';

const TOP_COUNTS = [3, 5, 10, 20];

type TopCountSelectionProps = {
  value: string;
  onValueChange: (value: string) => void;
};

const styles = StyleSheet.create({
  radioContainer: {
    marginBottom: 20,
    backgroundColor: globalStyles.charcoal10,
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: globalStyles.charcoal30,
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 5,
  },
});

export default function TopCountSelection({ value, onValueChange }: TopCountSelectionProps) {
  return (
    <View style={styles.radioContainer}>
      <Text style={[globalStyles.fontSize18, { textAlign: 'center', marginBottom: 10 }]}>Show top:</Text>
      <RadioButton.Group onValueChange={onValueChange} value={value}>
        <View style={styles.radioGroup}>
          {TOP_COUNTS.map((count) => (
            <View key={count} style={styles.radioItem}>
              <RadioButton value={count.toString()} />
              <Text style={globalStyles.fontSize18}>{count}</Text>
            </View>
          ))}
        </View>
      </RadioButton.Group>
    </View>
  );
}
