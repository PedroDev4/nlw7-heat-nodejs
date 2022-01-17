import prismaClient from "../prisma"

class ProfileUserService {

    async getUserProfile(user_id: string) {
        return await prismaClient.user.findFirst({
            where: {
                id: user_id
            }
        });
    }
}

export { ProfileUserService };