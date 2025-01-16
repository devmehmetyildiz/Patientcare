import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

const useTabNavigation = ({
    additionalTabPrefix,
    history,
    tabOrder,
    mainRoute,
    resetParams
}) => {
    const location = useLocation()
    const [activeTab, setActiveTab] = useState(0)
    const key = additionalTabPrefix || 'tab'
    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const tabIndex = tabOrder.findIndex(u => u === params.get(key))
        if (activeTab !== tabIndex) {
            params.has(key)
                ? params.set(key, tabOrder[activeTab])
                : params.append(key, tabOrder[activeTab])
            if (resetParams) {
                (resetParams || []).forEach(param => {
                    if (params.has(param)) {
                        params.delete(param)
                    }
                });
            }
            history.push(`/${mainRoute}?${params.toString()}`)
        }
    }, [activeTab, history, tabOrder, location])

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        if (params.has(key)) {
            const tabIndex = tabOrder.findIndex(u => u === params.get(key))
            setActiveTab(tabIndex)
        }
    }, [])

    return {
        activeTab,
        setActiveTab,
    }
}

export default useTabNavigation