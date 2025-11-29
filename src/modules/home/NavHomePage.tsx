import React from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import Down_Arrow from "../../assets/icons/Down_Arrow.png";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Container = styled.div``;

const Header = styled.header`
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
`;

const HeaderContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 0.5rem;

  @media (min-width: 640px) {
    padding: 0 0.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 1rem;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
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

const Title = styled.h1`
  display: flex;
  flex-direction: column;
  color: #2563eb;
`;

const SubTitleFirst = styled.text`
  font-size: 0.875rem;
  color: #000000ff;
  font-weight: bold;
`;
const SubTitleSeccond = styled.text`
  font-size: 0.7rem;
  color: #6b7280;
  font-weight: thin;
`;

const Navigation = styled.nav`
  display: none;
  gap: 2rem;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const NavLink = styled.a`
  color: #374151;
  font-weight: 500;
  text-decoration: none;
  display: flex;
  flex-direction: row;
  align-items: center;

  &:hover {
    color: #2563eb;
  }
`;

const SubNavLink = styled.span``;
const NavIcon = styled.img`
  margin-top: 3px;
  margin-left: 4px;
  width: 14px;
  height: 14px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LoginButton = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const NavHomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("home");

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <Container>
      {/* Header */}
      <Header>
        <HeaderContainer>
          <HeaderContent>
            {/* Logo */}
            <LogoSection>
              <LogoIcon>
                <LogoText>L</LogoText>
              </LogoIcon>
              <Title>
                <SubTitleFirst>{t("nav.brandLine1")}</SubTitleFirst>
                <SubTitleSeccond>{t("nav.brandLine2")}</SubTitleSeccond>
              </Title>
            </LogoSection>

            {/* Navigation */}
            <Navigation>
              <NavLink href="#">{t("nav.links.home")}</NavLink>
              <NavLink href="#">
                <SubNavLink>{t("nav.links.resources")}</SubNavLink>{" "}
                <NavIcon src={Down_Arrow} alt="Down Arrow" />
              </NavLink>
              <LanguageSwitcher variant="pill" />
            </Navigation>

            {/* Right side icons and login */}
            <RightSection>
              <LoginButton onClick={handleLogin}>{t("nav.login")}</LoginButton>
            </RightSection>
          </HeaderContent>
        </HeaderContainer>
      </Header>
    </Container>
  );
};

export default NavHomePage;
