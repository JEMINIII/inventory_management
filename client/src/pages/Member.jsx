import React, { useEffect, useState } from "react";
import axios from "axios";
import InviteMembersModal from "./InviteMembersModal";

const Member = () => {
  const [name, setName] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const openInviteModal = () => {
    setIsInviteModalOpen(true);
  };

  const closeInviteModal = () => {
    setIsInviteModalOpen(false);
  };
  useEffect(() => {
    axios
      .get("http://localhost:8082")
      .then((res) => {
        if (res.data.Status === "success") {
          setName(res.data.name);
          console.log(name); 
        }
      })
      .catch((err) => console.log(err));
  }, []);
  const [activeTab, setActiveTab] = useState("All Members");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    };
  return (
    <section id="boxhero-main-view" className="tw-flex-1 tw-overflow-auto">
      <section
        className="tw-h-full tw-pr-50px"
        style={{ minWidth: "948px", maxWidth: "1660px" }}
      >
        <div className="tw-px-40px tw-pb-40px">
          <div className="_with-breadcrumbs_n780a_85 tw-flex-none">
            <section className="_title-section_n780a_91">
              <div className="_breadcrumbs_n780a_6">
                <span className="_breadcrumb_n780a_6">Settings</span>
              </div>
              <div className="_title_n780a_25">
                Members
                <div className="tw-flex tw-items-center tw-h-full">
                  <i className="icon icon-question _help_74"></i>
                </div>
              </div>
            </section>
          </div>
          <div className="tab-menu-container tw-flex-none tw-mt-[10px]">
            <div
              className={`tab-menu ${activeTab === "All Members" && "active"}`}
              onClick={() => handleTabClick("All Members")}
            >
              All Members
            </div>
            <div
              className={`tab-menu ${
                activeTab === "Custom Permissions" && "active"
              }`}
              onClick={() => handleTabClick("Custom Permissions")}
            >
              Custom Permissions
            </div>
          </div>
          

          <div className="tw-w-full tw-overflow-x-auto">
          {activeTab === "All Members" && (
            <div>
              <div className="tw-flex tw-items-center tw-flex-none tw-mt-10px _control-bar_zpmz1_1">
            <button onClick={openInviteModal} className="btn blue medium with-icon">
              <i className="icon icon-plus-thin left-icon"></i>Invite Members
            </button>
            <InviteMembersModal open={isInviteModalOpen} onClose={closeInviteModal} />
          </div>

          <div className="tw-w-full tw-overflow-x-auto">
            <table className="general-table tw-w-full tw-mt-[10px]">
              <thead>
                <tr className="general-table--header">
                  <th>Name</th>
                  <th>Permissions</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr className="general-table--item">
                  <td>
                    <div className="tw-flex tw-items-center">
                      <span className="tw-truncate _name_zpmz1_5">{name}</span>
                    </div>
                  </td>
                  <td className="tw-flex tw-items-center tw-flex-auto">
                    <button
                      disabled=""
                      className="btn with-icon tw-flex tw-justify-between _role-selector_5o2kw_4"
                    >
                      <span className="tw-truncate">Admin</span>
                      <i className="icon icon-dropdown right-icon"></i>
                    </button>
                    <div className="tw-truncate tw-ml-20px tw-flex-auto">
                      Can access all data and activities.
                    </div>
                  </td>
                  <td className="tw-flex-none tw-text-right">
                    <button className="btn medium tw-text-danger">Leave</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
            </div>
          )}
          {activeTab === "Custom Permissions" && (
            <div>
              <table className="general-table tw-w-full tw-mt-[10px]">
      <thead>
        <tr className="general-table--header">
          <th className="_col-name_12v3f_5">Name</th>
          <th className="_col-member_12v3f_9">Member</th>
          <th></th>
        </tr>
      </thead>
      <tbody className="_role-table_12v3f_17">
        <tr className="general-table--item">
          <td colSpan="3" className="tw-text-base tw-text-gray-2 tw-text-center">
            No custom permissions yet.
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr className="general-table--footer">
          <td colSpan="3">
            <div className="tw-text-primary tw-cursor-pointer tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center _add-btn_12v3f_25">
              <i className="icon icon-plus-thin"></i>Add Custom Permissions
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
            </div>
          )}
        </div>

          
        </div>
      </section>
    </section>
  );
};

export default Member;
