import React, { useEffect } from "react"
import Script from "next/script"
import { PolotnoContainer, SidePanelWrap } from "polotno"
import { createStore } from "polotno/model/store"
import { CustomSidePanel } from "./CustomSidePanel"
import { RightSidePanel } from "./RightSidePanel"
import { CustomWorkspace } from "./CustomWorkspace"
import Header from "./Header"

const store = createStore({
  key: process.env.NEXT_PUBLIC_POLOTNO_API_KEY || "",
  showCredit: false,
})
const page = store.addPage()

export const DesignEdit = ({ customer }: any) => {
  useEffect(() => {
    // Check for saved template in localStorage
    const savedTemplate = localStorage.getItem('polotno-template');
    
    if (savedTemplate) {
      try {
        // Parse the template if it's a string
        const jsonData = JSON.parse(savedTemplate);
        
        // Import the JSON data into the store
        store.loadJSON(jsonData);
        
        // Clear the template data from localStorage after loading
        localStorage.removeItem('polotno-template');
      } catch (e) {
        console.error('Error loading template from localStorage:', e);
      }
    }
  }, []);
  return (
    <div className="h-screen flex flex-col">
      <Header customer={customer} />
      <div className="flex-1 flex">
        <PolotnoContainer className="flex relative">
          <SidePanelWrap className="w-16 md:w-20 border-r border-gray-200 flex-shrink-0">
            <CustomSidePanel store={store} customer={customer} />
          </SidePanelWrap>

          <CustomWorkspace store={store} />

          <div className="hidden sm:block">
            <RightSidePanel store={store} customer={customer} />
          </div>

          <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
            {
              //@ts-ignore
              <RightSidePanel store={store} isMobile />
            }
          </div>
        </PolotnoContainer>
      </div>
      <div id="deployment-a5d8bc8c-7c2b-4ee2-b0cb-481a2fe78e4b"></div>
      <Script 
        src="https://studio.pickaxe.co/api/embed/bundle.js" 
        strategy="afterInteractive"
      />
    </div>
  )
}

export default DesignEdit
