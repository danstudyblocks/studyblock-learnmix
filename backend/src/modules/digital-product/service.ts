import { MedusaService } from "@medusajs/framework/utils"
import DigitalProduct from "./models/digital-product";
import DigitalProductOrder from "./models/digital-product-order";
import DigitalProductMedia from "./models/digital-product-media";
import ProductPdfAttachment from "./models/product-pdf-attachment";

class DigitalProductModuleService extends MedusaService({
  DigitalProduct,
  DigitalProductMedia,
  DigitalProductOrder,
  ProductPdfAttachment
}) {

}

export default DigitalProductModuleService