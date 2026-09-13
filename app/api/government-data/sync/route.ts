// Next.js Route Handler: Government Open Data API Synchronization & Pipeline Execution
import { NextResponse } from "next/server"
import { GovOpenDataClient } from "@/lib/open-data-api"
import { runGovDataPreprocessingPipeline, PipelineOutput } from "@/lib/data-pipeline"

// In-memory cache for demo/server runtime
let cachedSyncState: {
  lastSynced: string
  datasetSource: string
  isLiveApi: boolean
  license: string
  pipelineResult: PipelineOutput
} | null = null

export async function GET() {
  if (!cachedSyncState) {
    const client = new GovOpenDataClient()
    const rawData = await client.fetchIndustrialApprovalsDataset()
    const pipelineResult = runGovDataPreprocessingPipeline(rawData.records)

    cachedSyncState = {
      lastSynced: rawData.syncTimestamp,
      datasetSource: rawData.sourceUrl,
      isLiveApi: rawData.isLiveApi,
      license: rawData.license,
      pipelineResult,
    }
  }

  return NextResponse.json({
    status: "healthy",
    lastSynced: cachedSyncState.lastSynced,
    datasetSource: cachedSyncState.datasetSource,
    isLiveApi: cachedSyncState.isLiveApi,
    license: cachedSyncState.license,
    metrics: cachedSyncState.pipelineResult.metrics,
    records: cachedSyncState.pipelineResult.records,
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const apiKey = body.apiKey || process.env.DATA_GOV_IN_API_KEY || ""
    const baseUrl = body.baseUrl || "https://api.data.gov.in"
    const resourceId = body.resourceId || "ogd-msme-clearances-2026"

    const client = new GovOpenDataClient(apiKey, baseUrl)
    const rawData = await client.fetchIndustrialApprovalsDataset(resourceId)
    const pipelineResult = runGovDataPreprocessingPipeline(rawData.records)

    cachedSyncState = {
      lastSynced: rawData.syncTimestamp,
      datasetSource: rawData.sourceUrl,
      isLiveApi: rawData.isLiveApi,
      license: rawData.license,
      pipelineResult,
    }

    return NextResponse.json({
      success: true,
      message: rawData.isLiveApi
        ? "Successfully synchronized with live data.gov.in API."
        : "Successfully synchronized with OGD India verified industrial benchmark dataset.",
      isLiveApi: rawData.isLiveApi,
      lastSynced: rawData.syncTimestamp,
      metrics: pipelineResult.metrics,
      records: pipelineResult.records,
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Failed to synchronize government open data",
      },
      { status: 500 },
    )
  }
}
