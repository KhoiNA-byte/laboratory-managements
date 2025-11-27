import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const Footer = styled.footer`
  background-color: #eff6ff;
  color: white;
  padding: 4rem 0;
`;

const Container = styled.div`
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

const GridContainer = styled.div`
  display: grid;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Column = styled.div``;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const LogoIcon = styled.div`
  width: 2rem;
  height: 2rem;
  background-color: #2563eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
`;

const LogoText = styled.span`
  color: white;
  font-size: 0.875rem;
  font-weight: bold;
`;

const CompanyName = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  color: #000000ff;
`;

const Description = styled.p`
  color: #000000ff;
  margin-bottom: 1.5rem;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const Stars = styled.div`
  display: flex;
  color: #fbbf24;
  margin-right: 0.5rem;
`;

const RatingText = styled.span`
  color: #000000ff;
`;

const UserCount = styled.div`
  color: #000000ff;
`;

const ColumnTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #000000ff;
`;

const LinksList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const LinkItem = styled.li`
  list-style: none;
`;

const FooterLink = styled.a`
  color: #000000ff;
  text-decoration: none;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: white;
  }
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-top: 1px solid #374151;
  margin-top: 3rem;
  padding-top: 2rem;
  text-align: center;
  color: #000000ff;
`;

const CopyrightText = styled.p``;

const MadeWithLove = styled.p`
  margin-top: 0.5rem;
`;

const FooterHomePage = () => {
  const { t } = useTranslation("home");
  const quickLinks = t("footer.quickLinks", {
    returnObjects: true,
  }) as string[];
  const supportLinks = t("footer.supportLinks", {
    returnObjects: true,
  }) as string[];

  return (
    <Footer>
      <Container>
        <GridContainer>
          {/* Left Column */}
          <Column>
            <LogoSection>
              <LogoIcon>
                <LogoText>L</LogoText>
              </LogoIcon>
              <CompanyName>{t("footer.companyName")}</CompanyName>
            </LogoSection>
            <Description>{t("footer.description")}</Description>
            <RatingContainer>
              <Stars>
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </Stars>
              <RatingText>{t("footer.ratingText")}</RatingText>
            </RatingContainer>
            <UserCount>{t("footer.userCount")}</UserCount>
          </Column>

          {/* Middle Column */}
          <Column>
            <ColumnTitle>{t("footer.quickLinksTitle")}</ColumnTitle>
            <LinksList>
              {quickLinks.map((link) => (
                <LinkItem key={link}>
                  <FooterLink href="#">{link}</FooterLink>
                </LinkItem>
              ))}
            </LinksList>
          </Column>

          {/* Right Column */}
          <Column>
            <ColumnTitle>{t("footer.supportTitle")}</ColumnTitle>
            <LinksList>
              {supportLinks.map((support) => (
                <LinkItem key={support}>
                  <FooterLink href="#">{support}</FooterLink>
                </LinkItem>
              ))}
            </LinksList>
          </Column>
        </GridContainer>

        <BottomSection>
          <CopyrightText>{t("footer.copyright")}</CopyrightText>
          <MadeWithLove>{t("footer.madeWithLove")}</MadeWithLove>
        </BottomSection>
      </Container>
    </Footer>
  );
};

export default FooterHomePage;
