import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CompleteLessonResponse, LessonDetail, LessonSummary } from '../../api/lessons';

interface LessonState {
    lessons: LessonSummary[];
    activeLesson: LessonDetail | null;
}

const initialState: LessonState = {
    lessons: [],
    activeLesson: null,
};

const lessonSlice = createSlice({
    name: 'lessons',
    initialState,
    reducers: {
        setLessons: (state, action: PayloadAction<LessonSummary[]>) => {
            state.lessons = action.payload;
        },
        setActiveLesson: (state, action: PayloadAction<LessonDetail>) => {
            state.activeLesson = action.payload;
        },
        setLessonCompletion: (state, action: PayloadAction<CompleteLessonResponse>) => {
            const progress = action.payload.progress;
            const lesson = state.lessons.find((item) => item.id === progress.lessonId);

            if (lesson) {
                lesson.completedAt = progress.completedAt;
                lesson.bestAccuracy = progress.bestAccuracy;
                lesson.attempts = progress.attempts;
            }
        },
    },
});

export const { setActiveLesson, setLessonCompletion, setLessons } = lessonSlice.actions;

export default lessonSlice.reducer;
