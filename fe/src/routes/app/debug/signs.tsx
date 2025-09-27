import { Box } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router'
import {SignCard} from "@/components/cards/sign-card.tsx";

export const Route = createFileRoute('/app/debug/signs')({
  component: RouteComponent,
})

function RouteComponent() {
    const signs = Array.from({ length: 20 }, (_, i) => ({
        signId: i,
        fileName: "invalid file name",
        categoryId: i + 2,
        categoryName: "kategorie cislo " + (i + 5).toString(),
        translations: ["překlad jedna", "překlad dva", "už jich je hodně", "uplne moc toho je"]

    }));

    return (
        <>
            <h1>Zkouška výpisu znaků</h1>
            <Box sx={{display: "flex", flexDirection: "row", gap: 2, flexWrap: "wrap"}}>
                {
                    signs.map(sign => (
                        <SignCard
                            key={sign.signId}
                            signId={sign.signId.toString()}
                            fileName={sign.fileName}
                            categoryId={sign.categoryId.toString()}
                            categoryName={sign.categoryName}
                            translations={sign.translations}
                        />
                    ))
                }
            </Box>
        </>
    )
}
