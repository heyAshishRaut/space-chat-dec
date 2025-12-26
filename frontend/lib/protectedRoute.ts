import axiosApi from "@/lib/axios"

const protectedRoute = async (fun: any) => {
    try {
        return await fun()
    } catch (err: any) {
        if (err.response?.status === 401 && err.response?.data?.message === "ACCESS_TOKEN_EXPIRED") {
            await axiosApi.post("/api/v1/user/refresh-access-token")

            return await fun()
        }
        throw err
    }
}

export default protectedRoute
