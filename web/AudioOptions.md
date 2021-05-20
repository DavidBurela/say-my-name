# Audio Storage Options for Voice Recordings

The objective was to investigate alternatives to self-hosting (on Azure), to avoid the need to manage PII issues associated with storing voice recordings.

## Option 1: Exchange property to store audio data for a user 

[Import-RecipientDataProperty cmdlet](https://docs.microsoft.com/en-us/powershell/module/exchange/import-recipientdataproperty?view=exchange-ps)

The above was investigated and based on the docs, seems to apply only to Exchange. 

## Option 2: Graph API extension

We investigated storing custom audio data via Graph API open extensions and schema extensions.

Unfortunately, this is deemed unviable due to the storage limit on both open and schema extensions. Neither are sufficient to accommodate audio data. 

[Open extension data limit is 2KB](https://docs.microsoft.com/en-us/graph/extensibility-overview#data-limits)

[Schema extension data limits](https://docs.microsoft.com/en-us/graph/api/resources/extensionproperty?view=graph-rest-1.0#properties)

Based on our investigation, there were no other user properties found in Graph API which would accommodate audio data. 

## Option 3: Utilizing Onedrive for Business

This would be a good option to consider. Note that for development we would need access to a dev tenant with a OneDrive for Business subscription enabled, which is billable. 

[See Onedrive for business plans](https://www.microsoft.com/en-sg/microsoft-365/onedrive/compare-onedrive-plans?activetab=tab:primaryr2)

## Option 4: Save on Azure storage (self-hosted)

- Will have to consider the security/privacy implications of storing PII (voice recordings) on Azure
- Will need an Azure subscription provided for dev purposes