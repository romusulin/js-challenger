import { Model } from 'sequelize';
import { getModel, TABLE } from '../db';

export namespace UserDbHelper {
	const seqModel: Model<UserRow, UserRow> = getModel(TABLE.USER) as Model<UserRow, UserRow>;

	export async function findByUsername(username: string): Promise<UserRow> {
		const user = await seqModel.findOne({
			where: { username }
		});

		return user;
	}

	export async function existsByUsername(username: string): Promise<boolean> {
		const potentialUser: UserRow = await findByUsername(username);

		return !!potentialUser;
	}

	export async function create(user: CreateUserRow): Promise<UserRow> {
		return await seqModel.create(user as UserRow);
	}
}

export interface UserRow extends CreateUserRow {
	id: number;
	updatedAt?: string;
	createdAt?: string;
}

export interface CreateUserRow {
	username: string;
	password: string;
}
