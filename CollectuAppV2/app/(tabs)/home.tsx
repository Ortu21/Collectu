import {
  YStack,
  Text,
  XStack,
  Button,
  useTheme,
  styled,
  Card,
  H1,
  H2,
  Paragraph,
} from "tamagui";
import React from "react";
import { Theme } from "@tamagui/core";

const StyledContainer = styled(YStack, {
  flex: 1,
  padding: 20,
  backgroundColor: "$background",
  gap: 20,
});

const StyledCard = styled(YStack, {
  padding: 20,
  borderRadius: 10,
  backgroundColor: "$background",
  borderWidth: 1,
  borderColor: "$borderColor",
  gap: 10,
});

const StyledButton = styled(Button, {
  backgroundColor: "$color",
  color: "$background",
  variants: {
    variant: {
      accent: {
        backgroundColor: "$accent",
      },
      warning: {
        backgroundColor: "$warning",
      },
      error: {
        backgroundColor: "$error",
      },
      success: {
        backgroundColor: "$success",
      },
    },
  },
});

export default function HomeScreen() {
  const [themeName, setThemeName] = React.useState<"dark" | "light">("dark");
  const theme = useTheme();

  // Estraiamo i valori dei colori in modo sicuro
  const backgroundColor = theme.backgroundColor?.val;
  const textColor = theme.color8?.val;
  const mutedColor = theme.colorMuted?.val;
  const currentTheme = theme.name?.toString() ?? "dark";

  console.log("Tema Attuale:", {
    background: backgroundColor,
    text: textColor,
    muted: mutedColor,
    palette: theme.palette?.get?.() ?? [],
    accent: theme.accent?.get?.() ?? [],
    warning: theme.warning?.get?.() ?? [],
    error: theme.error?.get?.() ?? [],
    success: theme.success?.get?.() ?? [],
  });

  const toggleTheme = () => {
    setThemeName(currentTheme === "dark" ? "light" : "dark");
  };

  return (
    <Theme name={themeName}>
      <StyledContainer>
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize={24} fontWeight="bold" color="$color">
            Test dei Temi Tamagui
          </Text>
          <Button
            onPress={toggleTheme}
            backgroundColor="$color"
            color="$background"
            paddingHorizontal={20}
            paddingVertical={10}
            borderRadius={8}
          >
            {currentTheme === "dark" ? "🌞 Light" : "🌙 Dark"}
          </Button>
        </XStack>

        <StyledCard>
          <Text fontSize={18} color="$color">
            Colori Base
          </Text>
          <XStack gap={10} flexWrap="wrap">
            <YStack
              padding={10}
              backgroundColor={backgroundColor}
              borderRadius={5}
            >
              <Text color={textColor}>Background</Text>
            </YStack>
            <YStack padding={10} backgroundColor={textColor} borderRadius={5}>
              <Text color={backgroundColor}>Color</Text>
            </YStack>
            <YStack padding={10} backgroundColor={mutedColor} borderRadius={5}>
              <Text color={backgroundColor}>Color Muted</Text>
            </YStack>
          </XStack>
        </StyledCard>

        <StyledCard>
          <Text fontSize={18} color="$color">
            Bottoni con Varianti
          </Text>
          {/* <XStack gap={10} flexWrap="wrap">
            <StyledButton>Default</StyledButton>
            <StyledButton variant="accent">Accent</StyledButton>
            <StyledButton variant="warning">Warning</StyledButton>
            <StyledButton variant="error">Error</StyledButton>
            <StyledButton variant="success">Success</StyledButton>
          </XStack> */}
        </StyledCard>

        <StyledCard>
          <Text fontSize={18} color="$color">
            Palette Colori
          </Text>
          <XStack gap={5} flexWrap="wrap">
            {Array.from({ length: 12 }).map((_, i) => (
              <YStack
                key={i}
                width={40}
                height={40}
                backgroundColor={theme.palette?.get?.()?.[i] ?? "#cccccc"}
                borderRadius={5}
              />
            ))}
          </XStack>
        </StyledCard>

        <StyledCard>
          <Text fontSize={18} color="$color">
            Informazioni Tema
          </Text>
          <Text color="$color">Nome Tema: {themeName}</Text>
          <Text color="$color">Background: {backgroundColor}</Text>
          <Text color="$color">Color: {textColor}</Text>
          <Card elevate size="$4" bordered animation={"bouncy"} hoverStyle={{scale : 0.950}}>
            <Card.Header padded bordered borderRadius={10} margin={10} >
              <H2>Sony A7IV</H2>
              <Paragraph theme="dark">Now available</Paragraph>
            </Card.Header>
            <Card.Footer padded>
              <XStack flex={1} />
              <Button borderRadius="$10">Purchase</Button>
            </Card.Footer>
            <Card.Background>
            </Card.Background>
          </Card>
        </StyledCard>
      </StyledContainer>
    </Theme>
  );
}
