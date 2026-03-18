import { 
  createWorkflow,
  transform,
  WorkflowResponse
} from "@medusajs/framework/workflows-sdk"
import { SVG_ASSET_MODULE } from "@/modules/svg-asset"
import createSvgAssetStep, { 
  CreateSvgAssetStepInput
} from "./steps/create-svg-asset"

type CreateSvgAssetWorkflowInput = CreateSvgAssetStepInput

const createSvgAssetWorkflow = createWorkflow(
  "create-svg-asset",
  (input: CreateSvgAssetWorkflowInput) => {
    const { svg_asset } = createSvgAssetStep(input)

    return new WorkflowResponse({
      svg_asset
    })
  }
)

export default createSvgAssetWorkflow
