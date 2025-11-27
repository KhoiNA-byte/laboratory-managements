import React from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { useTranslation, Trans } from "react-i18next";

const HeroSection = styled.section`
  background-color: #eff6ff;
  padding: 5rem 0;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

const GreenTag = styled.div`
  display: inline-block;
  background-color: #dcfce7;
  color: #1447e6;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #bbccffff;
`;

const MainHeading = styled.h1`
  font-size: 2.25rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1.5rem;
  max-width: 768px;

  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const BlueSpan = styled.span`
  color: #2563eb;
`;

const Description = styled.p`
  font-size: 1.125rem;
  color: #4b5563;
  margin-bottom: 2rem;
  max-width: 668px;
  margin-left: auto;
  margin-right: auto;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const CTAButton = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: 600;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const CTAButtonSeccond = styled.button`
  background-color: #ffffffff;
  color: #2563eb;
  padding: 0.75rem 2rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: 600;

  &:hover {
    background-color: #ffffffff;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const AvatarGroup = styled.div`
  display: flex;
  gap: 1px;
`;

const Avatar = styled.div`
  width: 2rem;
  height: 2rem;
  background-color: #2563eb;
  border-radius: 50%;
`;

const UserCount = styled.span`
  color: #4b5563;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Stars = styled.div`
  display: flex;
  color: #fbbf24;
`;

const RatingText = styled.span`
  margin-left: 0.5rem;
  color: #4b5563;
`;

const HeaderHomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("home");

  return (
    <HeroSection>
      <Container>
        {/* Green tag */}
        <GreenTag>{t("hero.badge")}</GreenTag>

        <MainHeading>
          <Trans i18nKey="home:hero.title" components={{ highlight: <BlueSpan /> }} />
        </MainHeading>
        <Description>
          {t("hero.description")}
        </Description>

        {/* CTA Buttons */}
        <ButtonContainer>
          <CTAButton onClick={() => navigate("/login")}>
            {t("hero.primaryCta")}
          </CTAButton>
          <CTAButtonSeccond onClick={() => navigate("/community")}>
            {t("hero.secondaryCta")}
          </CTAButtonSeccond>
        </ButtonContainer>

        {/* User count and rating */}
        <StatsContainer>
          <AvatarGroup>
            {[1, 2, 3, 4].map((item) => (
              <Avatar key={item}></Avatar>
            ))}
          </AvatarGroup>
          <UserCount>{t("hero.userCount")}</UserCount>
          <RatingContainer>
            <Stars>
              {[...Array(5)].map((_, i) => (
                <span key={i}>★</span>
              ))}
            </Stars>
            <RatingText>{t("hero.ratingText")}</RatingText>
          </RatingContainer>
        </StatsContainer>
      </Container>
    </HeroSection>
  );
};

export default HeaderHomePage;
