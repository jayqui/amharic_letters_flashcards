import { StyleSheet, ScrollView, Text, View } from "react-native"
import { Button } from "react-native-paper"
import * as globalStyles from "../globalStyles"
import { StatsSection } from "../types/StatsTypes"

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
})

export default function Stats() {
    const todayStats = {
        percentCorrect: 100,
        mostCorrectLetters: ["ቫ", "ቿ", "ሀ", "ሯ", "ው"],
        mostMissedLetters: ["ሑ", "መ", "ሄ", "ራ", "ሺ"],
    }
    const allTimeStats = {
        percentCorrect: 99,
        mostCorrectLetters: ["ቫ", "ቿ", "ሌ", "ሯ", "ሙ"],
        mostMissedLetters: ["ሿ", "መ", "ሄ", "ሮ", "ሺ"],
    }
    
    return (
        <ScrollView>
            <Text style={{...globalStyles.fontSize48, marginBottom: 20}}> Stats </Text>
            {renderStatsSection("Today", todayStats)}
            {renderStatsSection("All Time", allTimeStats)}
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
    )
}



function renderStatsSection(
    heading: string,
    { percentCorrect, mostCorrectLetters, mostMissedLetters }: StatsSection,
) {
    return (
        <View style={{marginBottom: 20}}>
            <Text style={globalStyles.fontSize24}>{heading}</Text>
            <Text style={globalStyles.fontSize18}>Percent Correct: {percentCorrect}%</Text>
            <Text style={globalStyles.fontSize18}>Most Correct Letters: {mostCorrectLetters.join(", ")}</Text>
            <Text style={globalStyles.fontSize18}>Most Missed Letters: {mostMissedLetters.join(", ")}</Text>
        </View>
    )
}
