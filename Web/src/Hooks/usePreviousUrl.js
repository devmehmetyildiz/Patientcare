import { useContext, useEffect, useState } from "react"
import { PreviousUrlContext } from "../Provider/PreviousUrlProvider";

const usePreviousUrl = () => {
    return useContext(PreviousUrlContext);
}

export default usePreviousUrl