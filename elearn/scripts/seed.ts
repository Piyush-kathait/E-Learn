import { PrismaClient } from "@prisma/client";
const database = new PrismaClient();

async function main() {
    try {
        await database.category.createMany({
            data: [
                { name: "Computer Science" },
                { name: "Music" },
                { name: "Fitness" },
                { name: "Design" },
                { name: "Photography" },
                { name: "Engineering" },
                { name: "Filming" },
                { name: "Editing" },
                { name: "Accounting" },

            ]
        })
        console.log("success");
    }
    catch (error) {
        console.log("error seeding the db categories", error);
    }
    finally {
        await
            database.$disconnect();
    }
}
main();