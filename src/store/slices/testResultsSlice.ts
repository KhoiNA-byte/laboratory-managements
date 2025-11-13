import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/** Comments shape used across app (match CommentsPage) */
export type CommentItem = {
  id: string;
  author: string;
  authorInitials?: string;
  role?: string;
  text: string;
  createdAt: string; // ISO
};

export type ListRow = {
  id: string;
  patientName: string;
  date: string;
  tester: string;
  status: "Completed" | "In Progress";
  source: "order" | "result";
  runId?: string;
};

export type TestResultRow = {
  id?: string | number;
  run_id?: string;
  test_result_id?: string | number;
  parameter_id?: string | number;
  parameter_name?: string;
  result_value?: number | string;
  flag?: string;
  evaluate?: string;
  deviation?: string;
  unit?: string;
};

export type TestResultDetailRow = {
  parameter: string;
  result: string;
  unit?: string;
  referenceRange?: string;
  deviation?: string;
  flag?: "High" | "Low" | "Normal" | "Critical";
  appliedEvaluate?: string;
};

export type TestResultDetail = {
  patientName: string;
  sex?: string;
  collected?: string;
  instrument?: string;
  criticalCount?: number;
  rows: TestResultDetailRow[];
  reviewedBy?: string;
  reviewedAt?: string;
  comments?: CommentItem[];
  run_id?: string;
};

interface RunTestPayload {
  orderId: string | number;
  instrumentId: string | number;
  sex?: "Male" | "Female";
  usedReagents?: { id: string | number; amountUsed: number; unit?: string }[];
}

interface UpdateCommentsPayload {
  runId: string;
  comments: CommentItem[];
}

interface TestResultsState {
  list: ListRow[];
  loadingList: boolean;
  listError: string | null;

  // run test
  running: boolean;
  runError: string | null;
  lastRunId?: string | number | null;
  lastResultId?: string | number | null;
  lastRunRows: TestResultRow[];

  // detail view
  detail?: TestResultDetail | null;
  loadingDetail: boolean;
  detailError: string | null;

  // comment updating
  updatingComments: boolean;
  updateCommentsError: string | null;

  deleting: boolean;
  deleteError: string | null;
}

const initialState: TestResultsState = {
  list: [],
  loadingList: false,
  listError: null,

  running: false,
  runError: null,
  lastRunId: null,
  lastResultId: null,
  lastRunRows: [],

  detail: null,
  loadingDetail: false,
  detailError: null,

  updatingComments: false,
  updateCommentsError: null,

  deleting: false,
  deleteError: null,
};

const slice = createSlice({
  name: "testResults",
  initialState,
  reducers: {
    // list
    fetchListRequest(state) {
      state.loadingList = true;
      state.listError = null;
    },
    fetchListSuccess(state, action: PayloadAction<ListRow[]>) {
      state.loadingList = false;
      state.list = action.payload;
    },
    fetchListFailure(state, action: PayloadAction<string>) {
      state.loadingList = false;
      state.listError = action.payload;
    },

    // run test
    runTestRequest(state, action: PayloadAction<RunTestPayload>) {
      state.running = true;
      state.runError = null;
      state.lastRunId = null;
      state.lastResultId = null;
      state.lastRunRows = [];
    },
    runTestSuccess(
      state,
      action: PayloadAction<{
        runId: string;
        testResultId: string | number;
        rows: TestResultRow[];
      }>
    ) {
      state.running = false;
      state.lastRunId = action.payload.runId;
      state.lastResultId = action.payload.testResultId;
      state.lastRunRows = action.payload.rows || [];
    },
    runTestFailure(state, action: PayloadAction<string>) {
      state.running = false;
      state.runError = action.payload;
    },

    // detail
    fetchDetailRequest(state, action: PayloadAction<string>) {
      state.loadingDetail = true;
      state.detailError = null;
      state.detail = null;
    },
    fetchDetailSuccess(state, action: PayloadAction<TestResultDetail>) {
      state.loadingDetail = false;
      state.detail = action.payload;
    },
    fetchDetailFailure(state, action: PayloadAction<string>) {
      state.loadingDetail = false;
      state.detailError = action.payload;
    },

    // update comments
    updateCommentsRequest(state, action: PayloadAction<UpdateCommentsPayload>) {
      state.updatingComments = true;
      state.updateCommentsError = null;
    },
    updateCommentsSuccess(state, action: PayloadAction<{ runId: string; comments: CommentItem[] }>) {
      state.updatingComments = false;
      // if current detail matches runId, update it locally too
      if (state.detail && state.detail.run_id === action.payload.runId) {
        state.detail.comments = action.payload.comments;
      }
    },
    updateCommentsFailure(state, action: PayloadAction<string>) {
      state.updatingComments = false;
      state.updateCommentsError = action.payload;
    },

    // delete
    deleteResultRequest(state, action: PayloadAction<string | number>) {
      state.deleting = true;
      state.deleteError = null;
    },
    deleteResultSuccess(state) {
      state.deleting = false;
    },
    deleteResultFailure(state, action: PayloadAction<string>) {
      state.deleting = false;
      state.deleteError = action.payload;
    },
  },
});

export const {
  fetchListRequest,
  fetchListSuccess,
  fetchListFailure,
  runTestRequest,
  runTestSuccess,
  runTestFailure,
  fetchDetailRequest,
  fetchDetailSuccess,
  fetchDetailFailure,
  updateCommentsRequest,
  updateCommentsSuccess,
  updateCommentsFailure,
  deleteResultRequest,
  deleteResultSuccess,
  deleteResultFailure,
} = slice.actions;

export default slice.reducer;
