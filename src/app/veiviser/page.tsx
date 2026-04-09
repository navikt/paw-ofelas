import { WizardShell } from "@/components/veiviser/WizardShell";
import { Box, Heading, VStack } from "@navikt/ds-react";

export default function VeiviserPage() {
  return (
    <main>
      <Box paddingBlock={{ xs: "space-16", md: "space-24" }} paddingInline={{ xs: "space-16", md: "space-40" }}>
        <VStack gap="space-8" style={{ maxWidth: "640px", margin: "0 auto" }}>
          <Heading size="xlarge" level="1">
            Hva trenger du hjelp med?
          </Heading>
          <WizardShell />
        </VStack>
      </Box>
    </main>
  );
}
