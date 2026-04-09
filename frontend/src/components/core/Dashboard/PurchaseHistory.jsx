import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"
import Img from './../../common/Img';

export default function PurchaseHistory() {
    const { token } = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [purchasedCourses, setPurchasedCourses] = useState(null)

    const getPurchasedCourses = async () => {
        try {
            const res = await getUserEnrolledCourses(token, navigate, dispatch);
            setPurchasedCourses(res);
        } catch (error) {
            console.log("Could not fetch purchase history.")
        }
    };

    useEffect(() => {
        getPurchasedCourses();
    }, [])

    // Loading Skeleton
    const sklItem = () => {
        return (
            <div className="flex border border-richblack-700 px-5 py-3 w-full">
                <div className="flex flex-1 gap-x-4 ">
                    <div className='h-14 w-14 rounded-lg skeleton '></div>
                    <div className="flex flex-col w-[40%] ">
                        <p className="h-2 w-[50%] rounded-xl  skeleton"></p>
                        <p className="h-2 w-[70%] rounded-xl mt-3 skeleton"></p>
                    </div>
                </div>
                <div className="flex flex-[0.4] flex-col ">
                    <p className="h-2 w-[20%] rounded-xl skeleton mt-2"></p>
                    <p className="h-2 w-[40%] rounded-xl skeleton mt-3"></p>
                </div>
            </div>
        )
    }

    if (purchasedCourses?.length === 0) {
        return (
            <p className="grid h-[50vh] w-full place-content-center text-center text-richblack-5 text-3xl">
                You have no purchase history. Let's explore the catalog!
            </p>
        )
    }

    return (
        <>
            <div className="text-4xl text-richblack-5 font-boogaloo text-center sm:text-left">Purchase History</div>
            {
                <div className="my-8 text-richblack-5">
                    {/* Headings */}
                    <div className="flex rounded-t-2xl bg-richblack-800 ">
                        <p className="w-[45%] px-5 py-3">Course Name</p>
                        <p className="w-1/4 px-2 py-3 hidden sm:flex">Price</p>
                        <p className="flex-1 px-2 py-3">Status</p>
                    </div>

                    {/* loading Skeleton */}
                    {!purchasedCourses && <div >
                        {sklItem()}
                        {sklItem()}
                        {sklItem()}
                    </div>}

                    {/* Course Names */}
                    {
                        purchasedCourses?.map((course, i, arr) => (
                            <div
                                className={`flex flex-col sm:flex-row sm:items-center border border-richblack-700 ${i === arr.length - 1 ? "rounded-b-2xl" : "rounded-none"}`}
                                key={i}
                            >
                                <div
                                    className="flex sm:w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                                    onClick={() => {
                                        navigate(`/courses/${course?._id}`)
                                    }}
                                >
                                    <Img
                                        src={course.thumbnail}
                                        alt="course_img"
                                        className="h-14 w-14 rounded-lg object-cover"
                                    />
                                    <div className="flex max-w-xs flex-col gap-2">
                                        <p className="font-semibold">{course.courseName}</p>
                                        <p className="text-xs text-richblack-300">
                                            Purchased on: {new Date(course.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Price - hidden on mobile, shown on larger devices */}
                                <div className="hidden sm:flex w-1/4 px-2 py-3 font-medium text-yellow-50">
                                    ₹ {course?.price || "Free"}
                                </div>

                                {/* Status */}
                                <div className="flex flex-1 sm:w-1/4 px-5 sm:px-2 py-3 text-caribbeangreen-100 font-medium">
                                    Successful
                                </div>
                            </div>
                        ))
                    }
                </div>
            }
        </>
    )
}
