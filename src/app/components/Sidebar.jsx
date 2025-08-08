"use client";

import { useTheme } from "@/hooks/useTheme";
import Navigation from "./Navigation";

export const Sidebar = () => {
    const { getCurrentThemeColors } = useTheme();
    const colors = getCurrentThemeColors();
    return (
        <div className="w-64" style={{ backgroundColor: colors.primary[600] }}>
            <div className="h-full flex flex-col text-white">
                {/* Logo */}
                <div className="p-6 border-b" style={{ borderColor: colors.primary[500] }}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="font-bold text-sm" style={{ color: colors.primary[600] }}>P</span>
                    </div>
                    <span className="text-xl font-bold">Portfos Console</span>
                </div>
                </div>

                {/* Navigation */}
                <Navigation />


                {/* Footer */}
                <div className="p-4 border-t" style={{ borderColor: colors.primary[500] }}>
                    <div className="text-center" style={{ color: colors.primary[200] }}>
                        <p className="text-xs">© 2024 All Rights Reserved</p>
                        <p className="mt-1 text-xs">Made by Finarkein</p>
                    </div>
                </div>
            </div>
        </div>
    )
}