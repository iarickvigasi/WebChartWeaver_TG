import softSkillsTestMap from './softSkillsTestMap.json' assert { type: 'json' }

const getTestReplyByQuestion = (testData, question) => {
    let foundTest = null
    testData.forEach((test) => {
        if (test.header == question) {
            foundTest = test
        }
    })
    return foundTest
}

// Calculates soft skills test
// testData - array of objects with header and value
// softSkillsTestMap - object with questions and answers
// returns array of skills with calculated results
const calculateSoftSkillsTest = (testData) => {
    const questionKeys = Object.keys(softSkillsTestMap)
    let skillResults = {}

    questionKeys.forEach((questionKey) => {
        const test = softSkillsTestMap[questionKey]
        const userQuestionResult = getTestReplyByQuestion(testData, test.question)

        if (userQuestionResult) {
            const estimation = parseInt(test[userQuestionResult.value])
            const skill = test.skill[0]
            skillResults[skill] = skillResults[skill] ? skillResults[skill] + estimation : estimation
        }
    })

    return skillResults
}

export {
    calculateSoftSkillsTest
}