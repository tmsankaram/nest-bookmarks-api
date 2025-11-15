import { ForbiddenException, Injectable } from "@nestjs/common";
import { DbService } from "src/db/db.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
@Injectable()
export class AuthService {
	constructor(private db: DbService) { }
	async signup(dto: AuthDto) {
		// generate the password
		const hash = await argon.hash(dto.password)
		try {

			// save the new user to the db
			const user = await this.db.user.create({
				data: {
					email: dto.email,
					hash
				}
			})
			return { id: user.id, email: user.email, createdAt: user.createdAt }

		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code == "P2002") {
					throw new ForbiddenException('User already exists')
				}
			}
			throw error

		}
		// return the saved user
	}

	async signin(dto: AuthDto) {
		// find user by email
		const user = await this.db.user.findUnique({
			where: {
				email: dto.email
			}
		})
		if (!user)
			throw new ForbiddenException(
				'Invaild Email/Password'
			);
		const pwMatch = await argon.verify(user.hash, dto.password)
		if (!pwMatch)
			throw new ForbiddenException(
				'Invaild Email/Password'
			);

		return { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email }
	}
}
