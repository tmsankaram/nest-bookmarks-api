import { Injectable } from "@nestjs/common";
import { DbService } from "src/db/db.service";

@Injectable({})
export class AuthService {
	constructor(private db: DbService) { }
	signup() {
		return 'I have signed up'
	}

	signin() {
		return 'I have signed in'
	}

}
