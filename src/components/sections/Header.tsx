import React, { FC } from "react";
import { useHistory, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Button from "../UI/Button";
import { RootState } from "../../store";
import { signout } from "../../store/actions/authActions";

//!In Header component we can update AppName link “to” property to go to dashboard if we are on homepage and to homepage if we are on dashboard page:
const Header: FC = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { authenticated } = useSelector((state: RootState) => state.auth);

  const logoutClickHandler = () => {
    dispatch(signout());
  };

  return (
    <nav className="navbar is-spaced has-shadow">
      <div className="container">
        <div className="navbar-brand">
          <Link
            className="navbar-item"
            to={
              !authenticated
                ? "/"
                : location.pathname === "/dashboard"
                ? "/"
                : "/dashboard"
            }
          >
            AppName
          </Link>
        </div>

        <div className="navbar-end">
          <div className="navbar-items">
            {!authenticated ? (
              <div className="buttons">
                <Button
                  text="Sign up"
                  onClick={() => history.push("/signup")}
                  className="is-primary"
                />
                <Button
                  text="Sign in"
                  onClick={() => history.push("/signin")}
                />
              </div>
            ) : (
              <Button text="Sign out" onClick={logoutClickHandler} />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
