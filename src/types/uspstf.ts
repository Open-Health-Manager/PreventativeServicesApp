/**
 * Types for the https://www.uspreventiveservicestaskforce.org/ API.
 */

/**
 * Key in the Grade array. A type more for documentation purposes than anything
 * else.
 */
export type Grade = string;

// These are apparently the only two values allowed in the USPSTF API
export type Sex = "male" | "female";
// For now, these are the same.
export type Gender = Sex;

/**
 * For documentation purposes, indicates a string represents an integer.
 */
export type IntAsString = string;

export type BMI = "UW" | "N" | "O" | "OB";

export type SpecificRecommendation = {
    id: number;
    title: string;
    grade: Grade;
    /**
     * From the API doc: the version of the grade. index into the grade array. see grades
     */
    gradeVer: number;
    gender: Gender;
    sex: Sex;
    ageRange: [number, number];
    text: string;
    rationale?: string;
    servFreq?: string;
    riskName?: string;
    riskText?: string;
    risk: string[];
    general: IntAsString;
    tool?: IntAsString[];
    bmi?: BMI;
};

export type GeneralRecommendation = {
    topicType: string;
    topicYear: IntAsString;
    uspstfAlias: string;
    specific: number[];
    title: string;
    rationale?: string;
    clinical: string;
    clinicalUrl?: string;
    discussion: string;
    other?: string;
    otherUrl?: string;
    topic: string;
    /**
     * a string of keywords list separated by ‘|’
     */
    keywords: string;
    categories: IntAsString[];
    tool: IntAsString[];
};

export type APIResponse = {
    note?: string;
    // Actually a number, but encoded as a string for some reason.
    lastUpdated?: string;
    lastUpdatedText?: string;
    specificRecommendations: SpecificRecommendation[];
    grades: Record<string, string[]>;
    generalRecommendations: Record<string, GeneralRecommendation>;
};