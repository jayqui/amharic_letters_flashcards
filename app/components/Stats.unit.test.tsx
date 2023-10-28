import { render, screen } from '@testing-library/react-native';
import React from "react"
import Stats from "./Stats"

describe("Stats page", (): void => {
    it("shows stats for today", (): void => {
        render(<Stats />)
        
        expect(screen.getByText("Today")).toBeTruthy()
        expect(screen.getByText("Percent Correct: 100%")).toBeTruthy()
        expect(screen.getByText("Most Correct Letters: ቫ, ቿ, ሀ, ሯ, ው")).toBeTruthy()
        expect(screen.getByText("Most Missed Letters: ሑ, መ, ሄ, ራ, ሺ")).toBeTruthy()
    })

    it("shows stats for all time", (): void => {
        render(<Stats />)

        expect(screen.getByText("All Time")).toBeTruthy()
        expect(screen.getByText("Percent Correct: 99%")).toBeTruthy()
        expect(screen.getByText("Most Correct Letters: ቫ, ቿ, ሌ, ሯ, ሙ")).toBeTruthy()
        expect(screen.getByText("Most Missed Letters: ሿ, መ, ሄ, ሮ, ሺ")).toBeTruthy()
    })
})

