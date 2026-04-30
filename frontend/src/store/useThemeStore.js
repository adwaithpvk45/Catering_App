import { create } from "zustand";

export const useThemeStore = create((set)=>({

theme:localStorage.getItem("web-theme")||"light",
setTheme: (theme)=>{
      localStorage.setTheme("web-theme",theme)
      set({theme})
}
})

)