import { create } from 'zustand'
import { SLIDER_STEP } from '@renderer/components/left/contents/tree'

type SliderPos = {
  x: number
  y: number
}
export interface FolderListSliderStore {
  sliderPos: SliderPos
  setSliderPos: (sliderPos: SliderPos) => void
}

export const useFolderListSliderStore  = create<FolderListSliderStore>((set) => ({
  sliderPos: { x: SLIDER_STEP, y: SLIDER_STEP },
  setSliderPos: (sliderPos: SliderPos) => set(() => ({ sliderPos }))
}))
