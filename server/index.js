const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const { GovOpenDataClient } = require("../lib/open-data-api")
const { runGovDataPreprocessingPipeline } = require("../lib/data-pipeline")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

let cachedSyncState = null

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "government-data-api" })
})

app.get("/api/government-data/sync", async (req, res) => {
  try {
    if (!cachedSyncState) {
      const client = new GovOpenDataClient()
      const rawData = await client.fetchIndustrialApprovalsDataset()
      const pipelineResult = runGovDataPreprocessingPipeline(rawData.records)

      cachedSyncState = {
        lastSynced: rawData.syncTimestamp,
        datasetSource: rawData.sourceUrl,
        isLiveApi: rawData.isLiveApi,
        license: rawData.license,
        metrics: pipelineResult.metrics,
        records: pipelineResult.records,
      }
    }

    res.json({
      status: "healthy",
      lastSynced: cachedSyncState.lastSynced,
      datasetSource: cachedSyncState.datasetSource,
      isLiveApi: cachedSyncState.isLiveApi,
      license: cachedSyncState.license,
      metrics: cachedSyncState.metrics,
      records: cachedSyncState.records,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to sync government data",
    })
  }
})

app.post("/api/government-data/sync", async (req, res) => {
  try {
    const body = req.body || {}
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
      metrics: pipelineResult.metrics,
      records: pipelineResult.records,
    }

    res.json({
      success: true,
      message: rawData.isLiveApi
        ? "Successfully synchronized with live data.gov.in API."
        : "Successfully synchronized with OGD India verified industrial benchmark dataset.",
      isLiveApi: rawData.isLiveApi,
      lastSynced: rawData.syncTimestamp,
      metrics: pipelineResult.metrics,
      records: pipelineResult.records,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to synchronize government open data",
    })
  }
})

app.listen(PORT, () => {
  console.log(`Government data backend listening on port ${PORT}`)
})
