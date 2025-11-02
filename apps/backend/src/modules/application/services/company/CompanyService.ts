import { TCompanyValidator } from "@repo/shared/validators"
import { CompanyRepositoryImpl } from "@server/modules/infrastructure/repositories/company/CompanyRepositoryImpl"

export class CompanyService {
    constructor(private readonly companyRepository: CompanyRepositoryImpl) { }

    async createCompany(company: TCompanyValidator.TCreateCompanySchema) {
        return this.companyRepository.createCompany(company)
    }

    async updateCompanyLanguages(companyLanguages: TCompanyValidator.TUpdateCompanyLanguagesSchema) {
        return this.companyRepository.updateCompanyLanguages(companyLanguages)
    }
}   