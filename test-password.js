const argon2 = require("argon2");

const testPassword = async () => {
    const passwordHash = await argon2.hash("PracticeOnly-12345");

    const isMatch = await argon2.verify(
        passwordHash,
        "WrongPassword-12345"
    );

    console.log("Password matches:", isMatch);
};

testPassword().catch(console.error);