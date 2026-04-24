export const FETCH_TOKEN_ROW_FROM_TOKEN_TABLE = `SELECT * FROM "token" WHERE user_id=$1`;
export const CREATE_NEW_VERIFICATION_TOKEN = `
INSERT INTO 
token ("user_id", token, "is_used", purpose, "created_at", "expires_at") 
VALUES ($1, $2, $3, $4, $5, $6) 
RETURNING id`;
export const FETCH_EXISTING_USER = `SELECT * FROM "user" WHERE email=$1`;
export const CREATE_NEW_UNVERIFIED_USER = `
INSERT INTO 
"user" ("user_id", name, email, password, "is_blocked", "is_active", "created_at") 
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING id, email, name, "user_id"
`;
export const UPDATE_TOKEN_TABLE_TO_VERIFIED = `
UPDATE "token"
SET is_used = $1
    used_at = $2
WHERE user_id = $3
`;
