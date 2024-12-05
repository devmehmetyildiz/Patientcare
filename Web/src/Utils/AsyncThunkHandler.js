import AxiosErrorHelper from "./AxiosErrorHelper";


const AsyncThunkHandler = async (config) => {

    const {
        Data,
        dispatch,
        getState,
        Domain,
        Route,
        ReqType,
        Notification,
        NotificationType,
        NotificationCode,
        NotificationMessage,
        RedirectUrl,
        BaseUrl,
        PageName,
        ReturnFullData,
    } = config


    const clearForm = Data?.clearForm
    const closeModal = Data?.closeModal
    const history = Data?.history

    try {
        const response = await instanse.get(Domain, Route);

        clearForm && clearForm(PageName)
        closeModal && closeModal()
        history && history.push(RedirectUrl ? RedirectUrl : BaseUrl);

        if (dispatch && Notification) {

            const state = getState()
            const t = state?.Profile?.i18n?.t||

            dispatch(Notification({
                type: NotificationType,
                code: NotificationCode,
                description: NotificationMessage,
            }));
        }

        return ReturnFullData ? response?.data?.list : response.data;

    } catch (error) {
        const errorPayload = AxiosErrorHelper(error);
        dispatch(Notification(errorPayload));
        throw errorPayload;
    }
}

export default AsyncThunkHandler