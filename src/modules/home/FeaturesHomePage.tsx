import React from "react";
import styled from "styled-components";
import { useTranslation, Trans } from "react-i18next";

const Section = styled.section`
  padding: 5rem 0;
  background-color: #f9fafb;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const MainTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const GridContainer = styled.div`
  display: grid;
  gap: 1rem;
  justify-items: center;
  max-width: 1000px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px 5px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  transition: box-shadow 0.2s ease-in-out;
  max-width: 330px;
`;

const FeatureIcon = styled.div`
  font-size: 1.875rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
`;

const FeatureDescription = styled.p`
  color: #4b5563;
`;
const BlueSpan = styled.span`
  color: #2563eb;
`;

const featureItems = [
  { icon: "🧪", key: "testManagement" },
  { icon: "📊", key: "smartAnalysis" },
  { icon: "👥", key: "community" },
  { icon: "🛡️", key: "security" },
  { icon: "⚡", key: "realtime" },
  { icon: "🏆", key: "quality" },
];

const FeaturesHomePage = () => {
  const { t } = useTranslation("home");

  return (
    <Section>
      <Container>
        <HeaderSection>
          <MainTitle>
            <Trans i18nKey="home:features.title" components={{ highlight: <BlueSpan /> }} />
          </MainTitle>
        </HeaderSection>

        <GridContainer>
          {featureItems.map((feature, index) => (
            <FeatureCard key={index}>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>
                {t(`features.items.${feature.key}.title`)}
              </FeatureTitle>
              <FeatureDescription>
                {t(`features.items.${feature.key}.desc`)}
              </FeatureDescription>
            </FeatureCard>
          ))}
        </GridContainer>
      </Container>
    </Section>
  );
};

export default FeaturesHomePage;
