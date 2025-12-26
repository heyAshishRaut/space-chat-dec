import { queryOptions } from "@tanstack/react-query"
import protectedRoute from "@/lib/protectedRoute"
import axiosApi from "@/lib/axios"

const UserDetailsOptions = () => {
    return queryOptions({
        queryKey: [`user-details`],
        queryFn: userDetails
    })
}

const userDetails = async () => {
    const res = await protectedRoute(() => axiosApi.get(`/api/v1/user/user-details`))
    return res.data.data
}

export default UserDetailsOptions