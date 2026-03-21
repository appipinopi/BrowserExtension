'use strict';

( () =>
{
	const browserApi = typeof browser !== 'undefined' ? browser : chrome;
	const notice = document.getElementById( 'update-notice' );
	if( !notice )
	{
		return;
	}

	const versionEl = notice.querySelector( '[data-update-version]' );
	const linkEl = notice.querySelector( 'a' );

	if( linkEl )
	{
		linkEl.href = GetUpdateLink( browserApi.runtime.id );
	}

	if( typeof browserApi.runtime.requestUpdateCheck === 'function' )
	{
		try
		{
			const result = browserApi.runtime.requestUpdateCheck( HandleUpdateResult );

			if( result && typeof result.then === 'function' )
			{
				result.then( HandlePromiseResult ).catch( IgnoreError );
			}
		}
		catch
		{
			// Ignore errors
		}
	}

	/**
	 * @param {any} value
	 * @returns {void}
	 */
	function HandlePromiseResult( value )
	{
		HandleUpdateResult( value );
	}

	/**
	 * @returns {void}
	 */
	function IgnoreError()
	{
		// Intentionally ignore
	}

	/**
	 * @param {any} statusOrResult
	 * @param {any} details
	 * @returns {void}
	 */
	function HandleUpdateResult( statusOrResult, details )
	{
		if( typeof statusOrResult === 'string' )
		{
			if( statusOrResult === 'update_available' )
			{
				ShowNotice( details?.version );
			}

			return;
		}

		if( statusOrResult && typeof statusOrResult === 'object' )
		{
			const status = statusOrResult.status || statusOrResult;

			if( status === 'update_available' )
			{
				ShowNotice( statusOrResult.version || details?.version );
			}
		}
	}

	/**
	 * @param {string|undefined} version
	 */
	function ShowNotice( version )
	{
		if( versionEl )
		{
			versionEl.textContent = version ? `(${version})` : '';
		}

		notice.hidden = false;
	}

	/**
	 * @param {string} runtimeId
	 */
	function GetUpdateLink( runtimeId )
	{
		if( runtimeId === 'kdbmhfkmnlmbkgbabkdealhhbfhlmmon' )
		{
			return 'https://chromewebstore.google.com/detail/steamdb/kdbmhfkmnlmbkgbabkdealhhbfhlmmon?utm_source=UpdateNotice';
		}

		if( runtimeId === 'hjknpdomhlodgaebegjopkmfafjpbblg' )
		{
			return 'https://microsoftedge.microsoft.com/addons/detail/steamdb/hjknpdomhlodgaebegjopkmfafjpbblg?utm_source=UpdateNotice';
		}

		if( runtimeId === 'firefox-extension@steamdb.info' )
		{
			return 'https://addons.mozilla.org/firefox/addon/steam-database/?utm_source=UpdateNotice';
		}

		return 'https://github.com/appipinopi/BrowserExtension/releases/latest';
	}
} )();
