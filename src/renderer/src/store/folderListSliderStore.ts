import { create } from 'zustand'
import { SLIDER_STEP } from '@renderer/components/left/contents/tree'

type SliderPos = {
  x: number
  y: number
  maxX: number
  maxY: number
  checked: boolean
}
export interface FolderListSliderStore {
  sliderPos: SliderPos
  setSliderPos: (sliderPos: SliderPos) => void
}

export const useFolderListSliderStore = create<FolderListSliderStore>((set) => ({
  sliderPos: { x: SLIDER_STEP, y: SLIDER_STEP, checked: false, maxX: 32, maxY: 32 },
  setSliderPos: (sliderPos: SliderPos) => set(() => ({ sliderPos }))
}))
