import { PiFilePdf } from "react-icons/pi"
import { Button } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface DigitalMedia {
    id: string
    type: "preview" | "main"
    fileId: string
    mimeType: string
}

interface DigitalProduct {
    id: string
    name: string
    medias: DigitalMedia[]
}

interface DigitalDownloadsProps {
    digitalProducts: DigitalProduct[]
}

const DigitalDownloads = ({ digitalProducts }: DigitalDownloadsProps) => {
    if (!digitalProducts?.length) {
        return (
            <section className="mt-[100px] pt-15">
                <div className="4xl:large-container grid grid-cols-12 gap-6 overflow-hidden rounded-2xl bg-white p-4 max-4xl:mx-4 sm:p-10">
                    <div className="col-span-12 flex flex-col items-center gap-y-4">
                        <h2 className="text-large-semi">No Digital Downloads Available</h2>
                        <p className="text-base-regular">
                            You have not purchased any digital products yet.
                        </p>
                        <div className="mt-4">
                            <LocalizedClientLink href="/" passHref>
                                <Button>Explore Products</Button>
                            </LocalizedClientLink>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="mt-[100px] pt-15">
            <div className="4xl:large-container grid grid-cols-12 gap-6 overflow-hidden rounded-2xl bg-white p-4 max-4xl:mx-4 sm:p-10">
                <div className="col-span-12 flex items-center justify-between gap-4">
                    <h4 className="heading-4">Digital Downloads</h4>
                    <p className="text-lg font-medium text-b300">
                        Showing {digitalProducts.length} digital Downloads
                    </p>
                </div>
                <div className="relative col-span-12 h-px">
                    <div className="line-horizontal absolute left-0 top-0 h-full w-full"></div>
                </div>
                <div className="col-span-12 rounded-2xl bg-white px-6 py-6 max-lg:overflow-x-auto">
                    <table className="w-full text-nowrap">
                        <thead>
                            <tr className="w-full bg-n20 py-4 text-center text-lg font-semibold">
                                <th className="py-4">Product Name</th>
                                <th className="py-4">Preview</th>
                                <th className="py-4">Download</th>
                            </tr>
                        </thead>
                        <tbody className="text-center font-medium text-n300">
                            {digitalProducts.map((product, idx) => {
                                const previewMedia = product.medias.find((m) => m.type === "preview")
                                const mainMedia = product.medias.find((m) => m.type === "main")

                                return (
                                    <tr key={product.id} className={`w-full ${idx % 2 !== 0 && "bg-n20"}`}>
                                        <td className="px-6 py-4">{product.name}</td>
                                        <td className="px-6 py-4">
                                            {previewMedia && previewMedia.mimeType.startsWith("image/") ? (
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/static/${previewMedia.fileId}`} // Adjust path if needed
                                                    alt={product.name}
                                                    className="h-12 w-12 rounded-md object-cover"
                                                />
                                            ) : (
                                                <span className="text-gray-500">No Preview</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {mainMedia ? (
                                                <a
                                                    href={`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/static/${mainMedia.fileId}`} // Adjust path if needed
                                                    download
                                                    className="flex items-center justify-center gap-2 text-blue-600 hover:underline"
                                                >
                                                    <span className="rounded-lg bg-n20 p-2 text-lg !leading-none text-b300">
                                                        <PiFilePdf />
                                                    </span>
                                                    <p>Download</p>
                                                </a>
                                            ) : (
                                                <span className="text-gray-500">No File Available</span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}

export default DigitalDownloads
