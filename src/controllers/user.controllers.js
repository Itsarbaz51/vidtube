import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.models.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js';


// 5. in loginuser

const generateAccessAndRefreshToken = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // 1. get user details from frontend
    // 2. validation - not emty
    // 3. check if user already exists: username, email
    // 4. check for images, avatar
    // 5. upload them to cloudinary, avatar
    // 6. create user object - create entry in db
    // 7. remove password and refresh token field from response
    // 8. check for user creation
    // 9. return response

    // 1.
    const {fullName, email, username, password} = req.body
    
    // 2.
    if (
        [fullName, email, username, password].some((field) => field?.trim() == "")
    ) {
        throw new ApiError(200, "All field are required")
    }

    //3.
    const existedUser = await User.findOne({
        $or: [ {email}, {username} ]
    })
    if (existedUser) {
        throw new ApiError(409, "User with email and username already exists")
    }

    // 4.
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(200, "Avatar file is required")
    }

    // 5.
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(200, "Avatar file is required")
    }

    // 6.
    const user = await User.create({
        fullName,
        username: username.toLowerCase(),
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url

    })

    // 7.
    const createdUser = User.findById(user._id).select("-password -refreshToken")
    
    // 8.
    if (!createdUser) {
        throw new ApiError(500, "Something went worng while registering user")
    }

    // 9.
    return res.status(201).
    json(
        new ApiResponse(
            200,
            "User Registered Sccessfully!"
        )
    )
})

const loginUser = asyncHandler(async (req, res) => {
    // 1. req body -> data
    // 2. username or email
    // 3. find the user
    // 4. check password
    // 5. access and refresh tokrn 
    // 6. send cookie
    // 7. return response


    // 1.
    const {username, email, password} = req.body

    // 2.
    if (!(username || email)) {
        throw new ApiError(400, "username or email is required")
    }

    // 3. 
    const user = await User.findOne({
        $or: [ {username}, {email} ]
    })

    if (!user) {
        throw new ApiError(404, "User does not exists")
    }

    // 4. 
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(404, "Invalid user credentials")
    }

    // 5.
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken")

    // 6.
    const options = {
        httpOnly: true,
        secure: true
    }

    // 7.
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
            user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"))
})

export {
    registerUser,
    loginUser,
    logoutUser
}