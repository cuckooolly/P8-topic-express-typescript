import passport from "passport";
import localStrategy from "../middlewares/passport/localStrategy";
import userRepository from "../repositories/userRepository";
import jwt from "../middlewares/passport/jwtStrategy";
import { User as PrismaUser } from "@prisma/client";

passport.use(localStrategy);

passport.use("access-token", jwt.accessTokenStrategy);
passport.use("refresh-token", jwt.refreshTokenStrategy);

// 세션 저장 시 req.session 에 user.id 값을 할당합니다.
passport.serializeUser((user, done) => {
  done(null, (user as PrismaUser).id); // req.session.passport.user = user.id
});
/* 
{
  "세션ID": {
    "passport": {
      "user":  user.id // done(null, user.id)에서 전달된 값
    }
    // 기타 세션 데이터
  }
}
*/

// req.session.passport.user 값이 첫 번째 매개변수인 id에 할당됩니다.
passport.deserializeUser(async (id: PrismaUser["id"], done) => {
  try {
    // id를 이용해 사용자 정보를 조회

    const user = await userRepository.findById(id);

    done(null, user); // req.user = user;
  } catch (error) {
    done(error);
  }
});

export default passport;
