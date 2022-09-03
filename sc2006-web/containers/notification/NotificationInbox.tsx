import react, { useState, useMemo, useContext, useEffect } from 'react';
import { GlobalContext } from '../../contexts';
import { Tooltip, Divider, notification } from 'antd';
import { NotificationBell } from '../../components/common';
import { NotificationRes } from '../../types';
import { notificationService } from '../../services';
import { useNotification } from '../../hooks';

interface NotificationInboxProps {
	uuids: string[];
}

export const NotificationInbox = react.memo(
	({ uuids }: NotificationInboxProps) => {
		const notification = useNotification();
		const [notifications, setNotifications] = useState<NotificationRes[]>([]);
		const [show, setShow] = useState(false);
		const [newCount, setNewCount] = useState(0);

		useEffect(() => {
			try {
				const populateInbox = async () => {
					const notificationResult =
						await notificationService.getUserNotifications({
							notificationUuids: uuids,
						});
					setNotifications(notificationResult);
					const unseenCount = notificationResult.reduce(
						(previousValue: number, nextNotification: NotificationRes) =>
							nextNotification.seenAt !== null
								? previousValue
								: previousValue + 1,
						0,
					);
					setNewCount(unseenCount);
				};
				populateInbox();
			} catch (e: any) {
				notification.apiError(e);
			}
		}, []);

		const onClickInbox = async () => {
			const markNewNotificationsAsSeen = async () => {
				const unseenNotifications = notifications.filter(
					(notification) => notification.seenAt === null,
				);

				if (unseenNotifications.length > 0) {
					const uuids = unseenNotifications.map(
						(notification) => notification.uuid,
					);
					await notificationService.markAllAsSeen({
						notificationUuids: uuids,
					});
				}
			};
			try {
				setShow((prevShow) => {
					// If there are unseen notifications, we will set them as seen once inbox is opened
					if (newCount != 0) {
						// mark as seen when inbox is opened
						if (!prevShow) {
							setNewCount(0);
							markNewNotificationsAsSeen();
						}
						// When closing inbox, update notifications stored in FE
						else {
							setNotifications((prevNotifications) => {
								const newNotifications = prevNotifications.map(
									(notification) => ({
										...notification,
										seenAt: new Date(),
									}),
								);
								return newNotifications;
							});
						}
					}

					return !prevShow;
				});
			} catch (e: any) {
				notification.apiError(e);
			}
		};

		return (
			<div className="flex flex-row justify-center items-center px-5">
				<Tooltip
					className="w-full"
					placement="bottom"
					color="white"
					visible={show}
					trigger="click"
					onVisibleChange={(visible) => setShow(visible)}
					overlayInnerStyle={{ padding: 0 }}
					title={
						<div className="overflow-y-auto w-60 min-h-60 max-h-98">
							<div className="grid grid-cols-1">
								{notifications.map(({ title, description, seenAt, uuid }) => {
									return seenAt !== null ? (
										<react.Fragment key={uuid}>
											<div className="text-black  p-4 text-left space-y-1">
												<b className="text-sm">{title}</b>
												<p className="text-sm">{description}</p>
											</div>
											<Divider style={{ margin: 0 }}></Divider>
										</react.Fragment>
									) : (
										<react.Fragment key={uuid}>
											<button className="text-black  bg-emerald-50 p-4 text-left space-y-1">
												<b className="text-base">{title}</b>
												<p className="text-sm">{description}</p>
											</button>
											<Divider style={{ margin: 0 }}></Divider>
										</react.Fragment>
									);
								})}
							</div>
						</div>
					}
				>
					<div className="flex flex-row justify-center items-center">
						<NotificationBell
							onClick={onClickInbox}
							isClicked={show}
							count={newCount}
						/>
					</div>
				</Tooltip>
			</div>
		);
	},
);
